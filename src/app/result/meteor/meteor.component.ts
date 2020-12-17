import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MeteorModel, ScoreData, GraphModel } from 'src/app/data/data.model';
import * as Papa from 'papaparse';
import { DatasetService } from 'src/app/services/dataset.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result-meteor',
  templateUrl: './meteor.component.html',
  styleUrls: ['./meteor.component.css']
})
export class MeteorComponent implements OnInit {
  @Input() data: any;

  @ViewChild('tabGroup', {static: false}) tabGroup;

  empty = {
    "?": true,
    "NaN": true
  };

  DEFAULT_NBIN = 30;
  options = ["subjects", "transitions"];

  array: {
    [name: string]: {
      max: number,
      min: number,
      bins: number,
      threshold: number
    }
  } = {};

  parsedData: MeteorModel = {};
  network: GraphModel;

  selectedIndex = 0;
  
  constructor(private router: Router, private datasetService: DatasetService) { }
  
  ngOnInit() {
    this.array
    this.options.forEach(key => this.parsedData[key] = {
        scores: {} as ScoreData,
        thresholds: this.data["output"][key]
    })
    this.getScoresCSVs();
    this.handleNetwork();
  }

  open() {
    document.getElementById("panel").style.overflow = "inherit";
  }

  close() {
    document.getElementById("panel").style.overflow = "hidden";
  }

  handleNetwork(){
    this.datasetService.getFile(this.data["files"]["dbn.json"].datasetId)
      .subscribe(result => this.network = JSON.parse(result));
  }

  downloadText() {
    this.datasetService.downloadFile(this.data["files"]["dbn.txt"].datasetId, "dbn.txt");
  }

  downloadOutliers() {
    let data = [["subject_id"]];
    if(this.options[this.tabGroup.selectedIndex] == "transitions") {
      for(let i = this.parsedData["transitions"].scores.firstIndex; i < this.parsedData["transitions"].scores.lastIndex + 1; ++i)
        data[0].push("t_" + i);
      
      let subject_id: any;
      this.parsedData[this.options[this.tabGroup.selectedIndex]].scores.data.forEach(element => {
        if(element.id != subject_id) {
          subject_id = element.id;
          data.push([subject_id.toString()]);
        }
        data[data.length - 1].push(element.score > this.array["transitions"].threshold ? "0" : "1");
      });
    } else {
      data[0].push(...["score", "outlier"]);
      this.parsedData[this.options[this.tabGroup.selectedIndex]].scores.data.forEach(element => 
        data.push([
          element.id.toString(),
          element.score.toString(),
          element.score > this.array["subjects"].threshold ? "0" : "1"
        ])
      );
    }

    this.datasetService.download(Papa.unparse(data), this.options[this.tabGroup.selectedIndex] + "_outliers.csv");
  }

  downloadScores() {
    this.datasetService.downloadFile(
      this.data["files"][this.options[this.tabGroup.selectedIndex] + ".csv"].datasetId,
      this.options[this.tabGroup.selectedIndex] + "_scores.csv"
    );
  }

  useDataset() {
    console.log("useDataset");
    if(this.options[this.tabGroup.selectedIndex] != 'subjects') return;
    
    this.datasetService.getFile(this.data.inputFiles["-i"])
      .subscribe(result => {
        console.log(result);
        let i = 0;
        let file = [];
        Papa.parse(result, {
          skipEmptyLines: true,
          delimiter: ",",
          newline: "\n",
          dynamicTyping: true,
          step: row => {
            if(file.length != 0)
              this.isSubjectOutlier(this.parsedData["subjects"].scores.data[i++].score) ? {} : file.push(row.data);
            else
              file.push(row.data);
          },
          complete: (result) => {
            let data = {
              "datasetName" : `${this.data.requestName}_no_outliers.csv`,
              "missing" : false,
              "discrete" : true
            }
            this.datasetService.postDataset(data, Papa.unparse(file)).subscribe(id => {
                console.log(result);
                data["dataset"] = Papa.unparse(file);
                data["datasetId"] = id;
                this.router.navigate(['/datasets/' + id], {state: {data: data}});
            });
          }
        });
      });
  }

  isSubjectOutlier(value: number) : boolean {
    return value < this.array["subjects"].threshold;
  }

  getScoresCSVs() {
    this.options.forEach(key => {
      var element = this.data["files"][key + ".csv"];
      console.log(key, this.data["files"], element);
      this.datasetService.getFile(element["datasetId"])
        .subscribe(result => {
          this.parseCsv(result, this.empty, this.parsedData[key.split(".")[0]].scores);
          this.array[key] = {
            max: Math.max.apply(Math, this.parsedData[key].scores.data.map(function(o) { return o.score; })),
            min: Math.min.apply(Math, this.parsedData[key].scores.data.map(function(o) { return o.score; })),
            bins: this.DEFAULT_NBIN,
            threshold: this.parsedData[key].thresholds.tukey
          }
          // this.selected = "subjects";
          // this.threshold = this.parsedData.subjects.thresholds.tukey;
          console.log(this.parsedData);
        });
      })
  }

  parseCsv(csv, empty: {}, results: ScoreData) {
    Papa.parse(csv, {
      skipEmptyLines: true,
      delimiter: ",",
      newline: "\n",
      dynamicTyping: true,
      step: (row: {data: string[]}) => {
		    results.data ? this.readSubject(row.data, results, empty) : this.readHeader(row.data, results);
      },
      complete: (result, file) => {
        // TODO raise error
      }
    });
  }

  readSubject(row: string[], results: ScoreData, empty: {}) {
    var id = row.shift();

    if (row.length != results.lastIndex - results.firstIndex + 1) {
      //TODO: Raise error
      // console.log("Wrong number of inputs " + row.length + " = " + results.numAttributes + " * " + results.numTimeSlices);
    }
    // console.log(row);
    row.forEach((element, i) => {
      results.data.push({
        id: id,
        i: results.firstIndex + i,
        score: empty[element] ? null : +element
      });
    });
  }

  readHeader(row: string[], results: ScoreData) {
    row.shift();

    if (row[0] == "score") {
      results.firstIndex = 0;
      results.lastIndex = 0;
      results.data = [];
      return;
    }

    // get first and last column time index
    results.firstIndex = parseInt(row[0].split("_")[1]);
    results.lastIndex = parseInt(row[row.length - 1].split("_")[1]);

    // TODO: Raise error if above didn't work

    // the number of columns per time slice must be constant
    // headers contains an extra column with subject id
    if (row.length % (results.lastIndex - results.firstIndex + 1) != 0) {
      //TODO: Raise error
      console.log("Header problem: " + results.lastIndex + " - " + results.firstIndex);
    }

    results.data = [];
  }
}
