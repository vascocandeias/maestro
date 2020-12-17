import { Component, OnChanges, Input, OnInit } from '@angular/core';
import { DatasetService } from 'src/app/services/dataset.service';
import * as Papa from 'papaparse';
import { BarChartModel } from 'src/app/data/data.model';

@Component({
  selector: 'app-result-isdt-dbn',
  templateUrl: './isdt-dbn.component.html',
  styleUrls: ['./isdt-dbn.component.css']
})
export class IsdtDBNComponent implements OnChanges {

  @Input() data: any;
  header: any;
  rows: any[];
  toPrint: File;
  nameToPrint: string;
  type: string;
  chartData: BarChartModel = {};

  constructor(private datasetService: DatasetService) { }

  ngOnChanges() {
    this.handleCSV();
  }

  handleCSV() {
    this.datasetService.getFile(this.data.files["inference.csv"].datasetId)
      .subscribe(result => this.parseResult(result));
  }

  download() {
    this.datasetService.download(this.toPrint, this.nameToPrint);
  }

  parseResult(csv: File) {
    this.toPrint = csv;
    if(csv[0] != 'D') {
      this.nameToPrint = "inference.csv";
      Papa.parse(csv, {
        skipEmptyLines: true,
        delimiter: ",",
        newline: "\n",
        dynamicTyping: true,
        complete: (result, file) => {
          this.header = result.data.shift();
          this.rows = result.data;
          this.type = "table";
          // TODO raise error
        }
      });
    }
    else this.parseChartData(csv);
  }

  parseChartData(csv) {
    var attribute: string, values: any[], id: any;
    var aux: BarChartModel = {};

    this.nameToPrint = "inference.txt";

    Papa.parse(csv, {
      skipEmptyLines: true,
      delimiter: ",",
      newline: "\n",
      dynamicTyping: true,
      step: row => {
        if(row.data.length == 1 && row.data[0].toString().split(" ")[0] == 'Distributions') {
          attribute = row.data[0].toString().split(" ")[1].slice(0,-1);
          aux[attribute] = {};
        } else if(row.data[0] == 'id') {
          row.data.shift();
          values = row.data;
        } else{
          id = row.data.shift();
          aux[attribute][id] = [];
          row.data.forEach((value: number, i: number) => {
            aux[attribute][id].push({
              value: values[i],
              frequency: value
            });
          })
        }
      },
      complete: (result, file) => {
        this.type = "histogram";
        this.chartData = aux;
        // TODO raise error
      }
    });
  }
}
