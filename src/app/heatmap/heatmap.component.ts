import { Component, ViewEncapsulation, ElementRef, ViewChild, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import * as svg2png from 'save-svg-as-png'
import { TimeSeriesModel } from '../data/data.model';
import { debounce } from '../debounce/debounce.decorator';

@Component({
  selector: 'app-heatmap',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss']
})
export class HeatmapComponent implements OnChanges {
  @ViewChild('heatmap', { static: false }) private heatmapContainer: ElementRef;

  @Input() dataset: TimeSeriesModel;

  data = [];
  headers: string[] = [];
  selected: string;
  selectedOption: string;
  step: number;
  startingY: number;
  ranges: number[];
  timeslices: number;
  totalSubjects: number;

  constructor() { }

  ngOnChanges() {
    if (!this.dataset) return;

    this.headers = this.dataset.headers;
    this.selected = this.headers[0];
    this.data = this.dataset.data[this.selected];
    this.startingY = 0;
    this.timeslices = this.dataset.lastIndex - this.dataset.firstIndex + 1;
    this.totalSubjects = this.data.length / this.timeslices;
    this.selectedOption = this.headers[0];
    
    this.ranges = [20, 50, 100, 500].filter(d => d < this.totalSubjects);
    this.ranges.push(this.totalSubjects);

    // this.ranges = [20, 50, 100, 500];
    this.step = Math.min(...this.ranges);
    
    if(this.heatmapContainer) this.heatmapCreate();
  }

  ngAfterViewInit() {
    if(this.dataset) this.heatmapCreate();
  }

  onChangeAttribute(column: string) {
    this.selectedOption = column;
    this.data = this.dataset.data[column];
    this.heatmapCreate()
  }

  onChangePaginator(event: any) {
    this.step = event.pageSize;
    this.startingY = event.pageIndex * event.pageSize;
    this.heatmapCreate();
  }

  onResize() {
    this.heatmapCreate();
  }

  download() {
    let div = document.getElementById("heatmap");
    svg2png.saveSvgAsPng(div.getElementsByTagName("svg")[0], this.selectedOption + ".png", {
      backgroundColor: "white",
      scale: 2
    });
  }

  @debounce(5)
  private heatmapCreate() {
    
    const {
      headers
    } = this.dataset;
    
    const totalSubjects = this.totalSubjects;
    let ranges = this.ranges.filter(d => d < totalSubjects);
    ranges.push(totalSubjects);
    let step = this.step === Math.min(...ranges) ? Math.min(...ranges): this.step;
    this.step = step;
    const timeslices = this.timeslices;
    let data = this.data.slice(
      this.startingY * timeslices,
      (this.startingY + step) * timeslices
    );
    const nSubjects = this.data.length / timeslices;
      
      
    // HTML components
    const heatmap = this.heatmapContainer.nativeElement;
    d3.select(heatmap).select("svg").remove()

    // const margin = { top: 20, right: 50, bottom: 40, left: 85 };
    const margin = { top: 20, right: 40, bottom: 40, left: 40 };
    const width = heatmap.offsetWidth - margin.left - margin.right;
    const height = data.length / timeslices * 15;

    const svg = d3.select(heatmap)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const myGroups = data.map(d => d.i);
    const myVars = data.map(d => d.id);

    // Axis
    const x = d3.scaleBand<number>()
      .range([0, width])
      .domain(myGroups)
      .padding(0.05);
    const xAxis = svg.append("g");
    xAxis.attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .select('.domain').remove()
    xAxis.append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", 30)
        .style("text-anchor", "center")
        .text("Timeslice")
      
    var y = d3.scaleBand()
      .range([0, height])
      .domain(myVars)
      .padding(0.05);
    svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y).tickSize(0))
      .select('.domain').remove();
    
    // Build color scale
    console.log("data", this.data)
    console.log("dataset", this.dataset)
    const colorScale =
      this.dataset.discrete === true
      || (Array.isArray(this.dataset.discrete) && this.dataset.discrete.includes(this.selectedOption))
        ? d3.scaleOrdinal<string>(d3.schemeSpectral[9])
          .domain(this.data.map(d => d.data))
        : d3.scaleQuantize<string>()
          .domain([d3.min(this.data.map(d => d.data)), d3.max(data.map(d => d.data))])
          .range(d3.schemeSpectral[9])

    // create a tooltip
    //TODO: add merge
    const tooltip = d3.select(heatmap).append("div")
      .attr("class", "tip")
      .style("display", "none");

    console.log("tooltip", tooltip)

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(d) {
      tooltip
        .style("display", "inline-block")
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    const mousemove = function(d) {
      tooltip
        .html(`The value of ${d.id}<br>at ${d.i} is ${d.data !== null? d.data: "missing"}`)
        .style("left", d3.mouse(this)[0] + 70 + "px")
        .style("top", d3.mouse(this)[1] + 150 + "px")
    }
    const mouseleave = function(d) {
      tooltip
        .style("display", "none")
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.9)
    }

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
        .attr("x", d => x(d.i)) // timeslice
        .attr("y", d => y(d.id)) // subject_id
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("opacity", 0.9)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style('fill', d => d.data !== null ? colorScale(d.data) : "white")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  }
}
