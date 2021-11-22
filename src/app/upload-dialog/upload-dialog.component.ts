import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as Papa from 'papaparse';
import { TimeSeriesModel } from '../data/data.model';
import { DatasetService } from '../services/dataset.service';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.css']
})
export class UploadDialogComponent implements OnInit {

  error: string = "";
  done: boolean = false;
  results = {} as TimeSeriesModel;
  original: Set<string>;
  uploading: boolean = false;

  empty = {
    "?": true,
    "NaN": true,
    "\r": true
  };

  constructor(
    public router: Router,
    private datasetService: DatasetService,
    public dialogRef: MatDialogRef<UploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.data.file.datasetName = this.data.file.dataset.name;
    this.data.file.missing = false;
    this.parseCsv(this.data.file.dataset, this.empty);
  }

  change(header: string, selected: boolean) {
    if(selected) this.data.file.discrete.add(header);
    else this.data.file.discrete.delete(header);
  }

  upload() {
    this.uploading = true;

    this.data.file.discrete = this.data.file.discrete.size == this.results.headers.length
      ? true
      : [...this.data.file.discrete]

    const data = {
      "datasetName" : this.data.file.datasetName,
      "missing" : this.data.file.missing,
      "discrete" : this.data.file.discrete
    }

    console.log("data", data);

    this.datasetService.postDataset(data, this.data.file.dataset).subscribe(id => {
      console.log(id);
      if(!id) {
        this.uploading = false;
        this.error = "There was an error uploading the dataset";
        return;
      }
      this.data.file.dataset.text().then(data => {
        this.data.file.dataset = data;
        this.data.file.datasetId = id;
        this.dialogRef.close();
        this.router.navigate(['/datasets/' + id], {state: {data: this.data.file}});
      })
    });
  }

  parseCsv(csv, empty: {}) {
    var data = {
      discrete: new Set<string>(),
      missing: false
    }
    Papa.parse(csv, {
      skipEmptyLines: true,
      delimiter: ",",
      newline: "\n",
      dynamicTyping: true,
      step: (row: {data: string[]}) => {
        if(this.error) return;
        this.results.headers ? this.readSubject(row.data, this.results, empty, data) : this.readHeader(row.data, this.results)
      },
      complete: (result, file) => {
        this.data.file.discrete = data.discrete;
        this.data.file.missing = data.missing;
        this.original = new Set(data.discrete);
        this.done = true;
        console.log("done")
        console.log(this.error)
        console.log(this.data.file)
      }
    });
  }

  readSubject(row: string[], dataset: any, empty: {}, data: { discrete: Set<string>, missing: boolean }) {
    var id = row.shift();
    let j = 0, i = 0;

    if(row.length != dataset.numAttributes * dataset.numTimeSlices) {
      this.error = "Wrong number of inputs on subject " + id + ".";
      return;
    }

    row.forEach((element) => {
      if(element === null || element === "" || empty[element])
        data.missing = true;
      else if(typeof element !== "number")
        data.discrete.add(dataset.headers[j]);

      if (++j == dataset.numAttributes) i++;
      j %= dataset.numAttributes;
    });

  }

  readHeader(row: string[], dataset: any) {
    try {
      row.shift();
      
      var test = row.every(val => val[0] !== "_" && val[val.length - 1] !== "_" && val.includes("__"));
      console.log("test", test);
      if(!test) throw new Error();
      

      // get first and last column time identifier
      dataset.firstIndex = parseInt(row[0].split("__")[1]);
      dataset.lastIndex = parseInt(row[row.length - 1].split("__")[1]);

      dataset.numTimeSlices = dataset.lastIndex - dataset.firstIndex + 1;

      // the number of columns per time slice must be constant
      // headers contains an extra column with subject id
      if (row.length % dataset.numTimeSlices != 0)
        throw new Error();

      dataset.numAttributes = row.length / dataset.numTimeSlices;

      dataset.headers = row.splice(0, dataset.numAttributes).map(v => v.split("__")[0]);
      dataset.data = new Map();
      dataset.headers.forEach(header => dataset.data[header] = []);
    } catch (error) {
      this.error = "Header is malformed.";
      return;
    }
  }
}
