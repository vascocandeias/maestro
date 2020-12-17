import { Component, OnInit, Input, OnChanges } from '@angular/core';

import * as  Papa from 'papaparse';

import { Observable, of } from 'rxjs';
import { TimeSeriesModel } from '../data/data.model';
import { DatasetService } from '../services/dataset.service';
import { ActivatedRoute } from '@angular/router';
import { isArray } from 'util';

@Component({
  selector: 'app-time-series',
  templateUrl: './time-series.component.html',
  styleUrls: ['./time-series.component.css']
})

export class TimeSeriesComponent implements OnChanges {
  @Input() file: any;
  @Input() id: string;

  empty = {
    "?": true,
    "NaN": true
  };

  implemented = [
    "learnDBN",
    "learnDBM",
    "learnsdtDBN",
    "meteor",
    "lr",
    "locf",
    "eqw",
    "eqf",
    "psdtDBN",
    "isdtDBN"
  ]

  general = []

  dataset: Observable<TimeSeriesModel>;

  constructor(
    private datasetService: DatasetService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    if(!this.file) this.ngOnChanges();
  }

  ngOnChanges() {
    if(history.state.data || this.file) this.setFile(history.state.data);
    else if(this.id) {
      console.log("getting timeseries", this.id)
      this.datasetService.getDataset(this.id).subscribe(r => this.setFile(r));
    }
    else this.datasetService.getDataset(this.route.snapshot.paramMap.get('datasetid')).subscribe(r => this.setFile(r));
  }

  setFile(file: any) {
    if(file !== undefined) this.file = file;
    if(this.file !== undefined) {
      this.getMethods();
      this.parseCsv(this.file.dataset, this.empty);
    }
    console.log("file", this.file);
  }

  getMethods() {
    this.datasetService.getMethods().subscribe(methods => {
      methods.forEach(element => {
        console.log(element)
        if(this.implemented.includes(element.method)) return;
        if(!element.mainFile.metadata) return
        for(let [key, value] of Object.entries(element.mainFile.metadata))
          // Change if needed to fix requirements
          if(this.file[key] !== value && (!Array.isArray(this.file[key]) || !Array.isArray(value))) return
        this.general.push(element.method);
      });
    })
  }

  download() {
    if(this.file.dataset.text)
      this.file.dataset.text().then(data => this.datasetService.download(data, this.file.datasetName));
    else 
      this.datasetService.download(this.file.dataset, this.file.datasetName)
  }

  isBoolean(val): boolean { return typeof val === 'boolean'; }

  parseCsv(csv, empty: {}) {
    var results = {} as TimeSeriesModel;
    Papa.parse(csv, {
      skipEmptyLines: true,
      delimiter: ",",
      newline: "\n",
      dynamicTyping: true,
      step: (row: {data: string[]}) => {
        results.headers ? this.readSubject(row.data, results, empty) : this.readHeader(row.data, results)
      },
      complete: (result, file) => {
        // TODO raise error
        results.discrete = this.file.discrete;
        this.dataset = of(results)
      }
    });
  }

  readSubject(row: string[], dataset: any, empty: {}) {
    var id = row.shift();
    let j = 0, i = 0;

    if (row.length != dataset.numAttributes * dataset.numTimeSlices) {
      //TODO: Raise error
      console.log("Wrong number of inputs " + row.length + " = " + dataset.numAttributes + " * " + dataset.numTimeSlices);
    }

    row.forEach((element) => {
      dataset.data[dataset.headers[j++]].push({
        id: id,
        i: dataset.firstIndex + i,
        data: empty[element] ? null : element
      });

      if (j == dataset.numAttributes) i++;
      j %= dataset.numAttributes;
    });

  }

  readHeader(row: string[], dataset: any) {
    row.shift();

    // get first and last column time identifier
    dataset.firstIndex = parseInt(row[0].split("__")[1]);
    dataset.lastIndex = parseInt(row[row.length - 1].split("__")[1]);

    // TODO: Raise error if above didn't work
    // System.err.println(Arrays.deepToString(headers));
    // System.err.println("Input file headers does not comply to the 'attribute__t' format.");

    dataset.numTimeSlices = dataset.lastIndex - dataset.firstIndex + 1;

    // the number of columns per time slice must be constant
    // headers contains an extra column with subject id
    if (row.length % dataset.numTimeSlices != 0) {
      //TODO: Raise error
      console.log("Header problem: " + row.length + " % " + dataset.numTimeSlices);
    }

    dataset.numAttributes = row.length / dataset.numTimeSlices;

    dataset.headers = row.splice(0, dataset.numAttributes).map(v => v.split("__")[0]);
    dataset.data = new Map();
    dataset.headers.forEach(header => dataset.data[header] = []);
  }
}