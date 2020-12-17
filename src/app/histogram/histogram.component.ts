import { Component, Input, OnChanges, ViewChild, ElementRef, ViewEncapsulation, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ScoreModel } from '../data/data.model';
import * as d3 from 'd3';
import { Bin } from 'd3';
import { debounce } from '../debounce/debounce.decorator';

@Component({
  selector: 'app-histogram',
  // encapsulation: ViewEncapsulation.None,
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss']
})
export class HistogramComponent implements OnChanges {
  @ViewChild('histogram', { static: false }) private histogramContainer: ElementRef;
  @ViewChild('heatmap', { static: false }) private heatmapContainer: ElementRef;

  @Input() data: ScoreModel;
  @Input() public get threshold() { return this.thresholdValue; }  
  thresholdValue: number;

  public set threshold(val) {
    this.thresholdValue = val
    if(!this.histogramContainer) return;
    this.update(100);
    this.updateHeatmap(100);
  }

  @Input() public get nbins() { return this.nbinsValue; }  
  nbinsValue: number;

  public set nbins(val) {
    this.nbinsValue = val
    if(!this.histogramContainer) return;
    this.update(1000);
  }
  
  scores: number[];
  GREEN = "#04CD66";
  YELLOW = "#FFA502";
  RED = "#CD0000";

  // Heatmap
  step: number;
  startingY: number;
  timeslices: number;
  totalSubjects: number;
  ranges: number[];
  dataset: { id: string; i: number; score: number; }[];
  margin = { top: 30, right: 60, bottom: 30, left: 85 };
  heatmapWidth: number;
  yAxisHeatmap: d3.Selection<SVGGElement, unknown, null, undefined>;
  xAxis: d3.Selection<SVGGElement, unknown, null, undefined>;
  heatmapSVG: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  heatmapG: d3.Selection<SVGGElement, unknown, null, undefined>;
  function: any;
  
  min: number;
  max: number;
  yAxis: d3.Selection<SVGGElement, unknown, null, undefined>;
  thresholdG: d3.Selection<SVGGElement, unknown, null, undefined>;


  histogram;
  // set the dimensions and margins of the graph
  width: number;
  height: number;


  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  x: d3.ScaleLinear<number, number>;
  y: d3.ScaleLinear<number, number>;


  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if(!this.data.scores.data) return;
    if(changes.nbins && !changes.nbins.isFirstChange() && changes.nbins.previousValue != changes.nbins.currentValue) return;
    if(changes.threshold && !changes.threshold.isFirstChange() && changes.threshold.previousValue != changes.threshold.currentValue) return;

    // if(this.dataset == this.data.scores.data) this.histogramCreate(true);
    this.dataset = this.data.scores.data;
    this.scores = [].concat.apply([], Object.values(this.data.scores.data).map(d => d.score)) as number[];
    
    // Heatmap
    this.step = -1;
    this.startingY = 0;
    this.timeslices = this.data.scores.lastIndex - this.data.scores.firstIndex + 1;
    this.totalSubjects = this.scores.length / this.timeslices;
    this.ranges = [20, 50, 100, 500].filter(d => d < this.totalSubjects);
    this.ranges.push(this.totalSubjects);
    this.step = this.step === -1? Math.min(...this.ranges): this.step;
    // console.log(this.dataset);
    if(this.histogramContainer) this.function = this.histogramCreate();
  }

  ngAfterViewInit() {
    if(this.data.scores.data) this.function = this.histogramCreate();
    console.log("running");
  }
  
  onResize() {
    this.histogramCreate();
  }

  histogramCreate() {

    this.histogram = this.histogramContainer.nativeElement;
    this.width = this.histogram.offsetWidth - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;

    // TODO: remove these removes
    d3.select(this.histogram).selectAll("svg").remove();

    [this.min, this.max] = d3.extent(this.scores); 
    
    // append the svg object to the body of the page
    this.svg = d3.select(this.histogram)
      .append("svg")
        // .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    // X axis: scale and draw:
    this.x = d3.scaleLinear()
        .domain([d3.min(this.scores), d3.max(this.scores)]) 
        .range([0, this.width]);
    this.svg.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(this.x));

    // Y axis: initialization
    this.y = d3.scaleLinear()
      .range([this.height, 0]);
    
    this.yAxis = this.svg.append("g");

    this.update(0);
    this.heatmapCreate();
  }

  onChangePaginator(event: any) {
    this.step = event.pageSize;
    this.startingY = event.pageIndex * event.pageSize;
    this.updateHeatmap(100);
  }   

  update = (transitionTime: number) => {
    const thresholds = d3.range(this.min, this.max, (this.max - this.min) / this.nbins); 
    
    // set the parameters for the histogram
    var hist = d3.histogram()
      .domain(<[number, number]>this.x.domain())  // then the domain of the graphic
      .thresholds(thresholds); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = hist(this.scores);
  
    // Y axis: scale and draw:
    this.y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously

    this.yAxis
      .transition()
      .duration(transitionTime)
      .call(d3.axisLeft(this.y));
  
    // Append the bar rectangles to the svg element
    var u = this.svg.selectAll<SVGRectElement, Bin<number, number>>("rect")
      .data(bins)
    
    // Manage the existing bars and eventually the new ones:
    u
      .enter().append<SVGRectElement>("rect")
        .attr("transform", `translate(${this.width} , ${this.height} )`)
      .merge(u)
      .transition() // and apply changes to all of them
      .duration(transitionTime)
        .attr("x", 1)
        .attr("transform", (d: any) => `translate(${this.x(d.x0)} , ${this.y(d.length)} )`)
        .attr("width", (d: any) => this.x(d.x1) - this.x(d.x0) > 1 ? this.x(d.x1) - this.x(d.x0) -1 : 0)
        .attr("height", (d: any) => this.height - this.y(d.length))
        .style("fill", (d: any) => d.x1 < this.threshold? this.RED : d.x0 < this.threshold ? this.YELLOW : this.GREEN)
  
    // If less bars in the new histogram, delete the ones not in use anymore
    u
      .exit()
      .remove();

    if(this.thresholdG) {
      this.thresholdG.remove();
    }

    this.thresholdG = this.svg.append("g");
    this.thresholdG
      .append("line")
    this.thresholdG
      .append("text")

    this.thresholdG
      .attr("transform", `translate(${this.x(this.threshold)}, 0)`)

    this.thresholdG.select('line')
      .attr("stroke", "grey")
      .attr("stroke-dasharray", "4")
      .attr("stroke", "grey")
      .attr("stroke-dasharray", "4")
      .attr("y1", this.y(0))
      .attr("y2", 0)

    this.thresholdG.select("text")
      .attr("transform", `translate(0, -10)`) // TODO: move away from line
      .style("font-size", "15px")
      .style("text-anchor", "middle")
      .text(`threshold: ${this.threshold.toFixed(2)}`)
  }

  heatmapCreate() {
    const nSubjects = this.scores.length / this.timeslices;

    // HTML components
    const heatmap = this.heatmapContainer.nativeElement;
    this.heatmapWidth = heatmap.offsetWidth - this.margin.left - this.margin.right;

    // TODO: remove this remove
    d3.select(heatmap).selectAll("svg").remove();

    this.heatmapSVG = d3.select(heatmap)
      .append("svg")
        .attr("width", this.heatmapWidth + this.margin.left + this.margin.right);
    this.heatmapG = this.heatmapSVG.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.yAxisHeatmap = this.heatmapG.append("g").attr("class", "y axis");
    
    if(this.timeslices != 1) {
      this.xAxis = this.heatmapG.append("g");
      this.xAxis.append("text")
          .attr("class", "label")
          .attr("x", this.heatmapWidth / 2)
          .attr("y", 30)
          .style("text-anchor", "center")
          .text("Timeslice")
    }
    this._updateHeatmap(0);
  }
  
  _updateHeatmap(duration: number) {
    let data = this.dataset.slice(
      this.startingY * this.timeslices,
      (this.startingY + this.step) * this.timeslices
    );

    const height = data.length / this.timeslices * 15;
    const myGroups = data.map(d => d.i);
    const myVars = data.map(d => d.id);
      
    this.heatmapSVG.attr("height", height + this.margin.top + this.margin.bottom)

    // Axis
    const x = d3.scaleBand<number>()
      .range([0, this.heatmapWidth])
      .domain(myGroups)
    if(this.timeslices != 1) {
      this.xAxis.attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x).tickSize(0))
          .select('.domain').remove()
    }
      
    var y = d3.scaleBand()
      .range([0, height])
      .domain(myVars)
    this.yAxisHeatmap
      .call(d3.axisLeft(y).tickSize(0))
      .select('.domain').remove();
    
    var u = this.heatmapG.selectAll<SVGRectElement, any>("rect")
      .data(data);

    u
      .enter().append<SVGRectElement>("rect")
        .attr("x", d => x(d.i)) // timeslice
        .attr("y", d => y(d.id)) // subject_id
        .attr("height", y.bandwidth())
        .attr("width", x.bandwidth())
      .merge(u)
      .transition()
      .duration(duration)
        .style('fill', d => d.score > this.threshold ? this.GREEN : this.RED);
    
    u
      .exit()
      .remove();

  }

  @debounce(100)
  updateHeatmap(duration: number) {
    this._updateHeatmap(duration);
  }
}

