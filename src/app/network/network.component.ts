import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { graphviz }  from 'd3-graphviz';
import * as d3 from 'd3';
import { GraphModel } from '../data/data.model';
import * as svg2png from 'save-svg-as-png'

@Component({
  selector: 'app-network',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnChanges {
  @Input() data: GraphModel;
  @Input() id: string;

  divId: string;
  tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  
  constructor() { }

  ngOnChanges() {
    if (!this.data) return;
    this.divId = this.id !== undefined? "network" + this.id : "network";

    if(document.getElementById(this.divId) && this.data.stationary) this.networkCreate();
  }

  ngOnDestroy() {
    this.tooltip.remove();
  }

  ngAfterViewInit(){
    if (this.data && this.data.stationary) this.networkCreate();
  }

  private networkCreate() {
    const net = this.data;
    const id = "#" + this.divId;

    graphviz(id, {zoom: false})
      .renderDot(net.network);

    this.tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("visibility", "hidden");
    
    var tooltip = this.tooltip;

    // TODO: fix scroll
    
    const mouseover = function(d) {
      var attribute = d.children[5].children[0].text;
      attribute = attribute.split("[")[0];
      if(!net.parameters[attribute]) return;
      tooltip
        .html(`<table id="myTable">
          <colgroup id="myColgroup" class="parents"></colgroup>
          </table>`)
      printTable(net.parameters, attribute)
      tooltip
        .style("left", Math.min(d3.event.pageX, Math.max(0, window.innerWidth - tooltip.node().offsetWidth - 20)) + "px")
        .style("top", Math.min(d3.event.pageY, Math.max(0, window.innerHeight - tooltip.node().offsetHeight - 20)) + "px")
        .style("visibility", "visible")
        .style("display", "block")

        console.log(d3.mouse(this))

      

    }
    const mouseleave = () => tooltip.style("visibility", "hidden");

    d3.selectAll('.node')
      .on('mouseover', mouseover)
      .on('mouseleave', mouseleave);

    d3.selectAll('title').remove();

    const buttonName = this.id !== undefined? "downloadButton" + this.id : "downloadButton";
    const downloadButton = document.getElementById(buttonName);

    d3.select(downloadButton).on("click", () => {
      console.log("hey");
      let div = document.getElementById(this.divId);
      svg2png.saveSvgAsPng(div.getElementsByTagName("svg")[0], this.divId + ".png", {scale:2});
    });
  }
}

function printTable(data: any, attribute: string){
  var table = document.getElementById("myTable") as HTMLTableElement;

  var header = table.createTHead();
  var row = header.insertRow(0);
  var iCell = 0;
  var parents = data[attribute].parents;
  var x = document.getElementById("myColgroup") as HTMLTableColElement;
  x.span = parents.length;

  parents.forEach(parent => {
    row.insertCell(iCell++).innerHTML = parent;
  });

  data[attribute].values.forEach(value => {
    row.insertCell(iCell++).innerHTML = `P(${attribute} = ${value})`;
  });
  
  var body = table.createTBody();

  var iRow = 0;
  data[attribute].table.forEach(data => {
    iCell = 0;
    let row = body.insertRow(iRow++);
    parents.forEach(parent => {
      row.insertCell(iCell++).innerHTML = `${data[parent]}`;
    });
    data.probabilities.forEach(p => {
      row.insertCell(iCell++).innerHTML = `${p}`;
    })
  });
}



