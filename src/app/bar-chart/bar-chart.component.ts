import { Component, ViewChild, ElementRef, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { BarChartModel } from '../data/data.model';
import { debounce } from '../debounce/debounce.decorator';
import * as svg2png from 'save-svg-as-png'

@Component({
  selector: 'app-bar-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges {
  @ViewChild('barchart', { static: false }) private barchartContainer: ElementRef;

  @Input() data: BarChartModel;

  barchart: any;
  function: void;
  margin: { top: number; right: number; bottom: number; left: number; };
  width: number;
  height: number;
  svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
  ids: string[];
  attributes: string[];
  selectedId: string;
  selectedAttribute: string;
  xAxis: d3.Selection<d3.BaseType, unknown, SVGGElement, unknown>;

  constructor() { }

  ngOnChanges(): void {
    if(!this.data) return;

    this.attributes = Object.keys(this.data);
    this.selectedAttribute = this.attributes[0];
    this.ids = Object.keys(this.data[this.selectedAttribute]);
    this.selectedId = this.ids[0];
    
    if(this.barchartContainer) this.function = this.createChart();
  }

  ngAfterViewInit() {
    if(this.data) this.function = this.createChart();
  }

  onChangeAttribute(attribute: string) {
    this.selectedAttribute = attribute;
    this.ids = Object.keys(this.data[this.selectedAttribute]);
    this.selectedId = this.ids.includes(this.selectedId) ? this.selectedId : this.ids[0];
    this.update(1000);
  }

  onChangeId(id: string) {
    this.selectedId = id;
    this.update(1000);
  }

  onResize() {
    this.createChart();
  }

  download() {
    let div = document.getElementById("barchart");
    svg2png.saveSvgAsPng(div.getElementsByTagName("svg")[0], this.selectedAttribute + "_" + this.selectedId + ".png", {
      backgroundColor: "white",
      scale: 2
    });
  }

  @debounce(5)
  createChart() {
    this.barchart = this.barchartContainer.nativeElement;
    // set the dimensions and margins of the graph
    this.margin = {top: 30, right: 30, bottom: 70, left: 60},
    this.width = this.barchart.offsetWidth - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;

    d3.select(this.barchart).selectAll("svg").remove();

    // append the svg object to the body of the page
    this.svg = d3.select(this.barchart)
      .append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + this.margin.left + "," + this.margin.top + ")");

    // X axis
    this.x = d3.scaleBand()
      .range([ 0, this.width ])
      .padding(0.2);
    this.xAxis = this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")

    // Add Y axis
    this.y = d3.scaleLinear()
      .domain([0, 1])
      .range([ this.height, 0]);
    this.svg.append("g")
      .call(d3.axisLeft(this.y));

    this.update(0);
  }

  update(duration: number) {

    var data = this.data[this.selectedAttribute][this.selectedId];

    this.x.domain(data.map(d => d.value));
    this.xAxis
      .transition()
      .duration(duration)
      .call(d3.axisBottom(this.x).bind(this))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    var u = this.svg.selectAll<SVGRectElement, any>("rect")
      .data(data)

    u
      .enter()
      .append("rect")
        .attr("height", d => this.height - this.y(0)) // always equal to 0
        .attr("y", d => this.y(0))
        .attr("x", d =>  this.x(d.value))
        .attr("width", this.x.bandwidth())
      .merge(u)
      .transition()
      .duration(duration)
        .attr("x", d =>  this.x(d.value))
        .attr("y", d => this.y(Math.max(d.frequency, 0)))
        .attr("width", this.x.bandwidth())
        .attr("height", d => this.height - this.y(Math.max(d.frequency, 0)))

    u
      .exit()
      .remove()
  }
}
