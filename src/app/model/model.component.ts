import { Component, OnInit, Input } from '@angular/core';
import { GraphModel } from '../data/data.model';
import { Router } from '@angular/router';
import { DatasetService } from '../services/dataset.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css']
})
export class ModelComponent implements OnInit {
  @Input() data: any;

  network: GraphModel;
  file = {    
      dataset: null,
      missing: false,
      discrete: false,
      datasetId: "",
      datasetName: ""
  }

  files = {};

  output: any;
  resultId: any;
  form: FormGroup;
  
  constructor(public router: Router, private datasetService: DatasetService) { }

  ngOnInit() {
    console.log(this.data);
    var requestName = this.data ? this.data.requestName + "_prediction" : "";
    this.form = new FormGroup({
      "request": new FormControl('isdtDBN', [Validators.required]),
      "-infFmt": new FormControl('distrSampl', [Validators.required]),
      "-obs": new FormControl('', [Validators.required]),
      "-obsStatic": new FormControl(''),
      "-inf": new FormControl(''),
      "-t": new FormControl(1),
      "notification": new FormControl(true),
      "requestName": new FormControl(requestName, [Validators.required])
    });
    this.form.controls['-t'].disable();
    this.handleNetwork();
  }

  ngOnChanges() {
    if(!this.form) return;
    if(!this.form.value.requestName && this.data)
      this.form.value.requestName = this.data.requestName + "_prediction";
  }

  handleNetwork(){
    this.datasetService.getFile(this.data["files"]["dbn.json"].datasetId)
      .subscribe(result => this.network = JSON.parse(result));
  };

  open() {
    document.getElementById("panel").style.overflow = "inherit";
  }

  close() {
    document.getElementById("panel").style.overflow = "hidden";
  }

  downloadText() {
    this.datasetService.downloadFile(this.data["files"]["dbn.txt"].datasetId, "network.txt");
  }

  add(event) {
    event.stopPropagation();
    event.preventDefault();
    document.getElementById("-" + event.srcElement.id).click();
    event.srcElement.blur();
  }
  
  changeMode(event) {
    if(event.value == 'isdtDBN') {
      this.form.controls['-inf'].enable();
      this.form.controls['-t'].disable();
      if(this.files['-inf']) this.form.controls['-inf'].setValue(this.files['-inf'].name);
    }
    else {
      this.form.controls['-t'].enable();
      this.form.controls['-inf'].disable();
      if(this.form.value['-infFmt'] == 'distrib') this.form.controls['-infFmt'].setValue('distrSampl');
    }
  }

  value(id) {
    return this.files[id] ? this.files[id].name : '';
  }
  
  removeFocus(event) {
    event.preventDefault();
    event.srcElement.blur();
  }

  handleFile(event) {
    delete this.files[event.srcElement.id];
    this.files[event.srcElement.id] = event.target.files[0];
    this.form.controls[event.srcElement.id].setValue(event.target.files[0].name);
    event.target.value = "";
  }

  clear(file) {
    event.stopPropagation();
    event.preventDefault();
    delete this.files[file];
    this.form.controls[file].setValue('');
  }

  makeRequest() {
    if(this.form.invalid) return;

    var params = JSON.parse(JSON.stringify(this.form.value));
    // var files = Object.keys(this.files).filter(e => e != '-obs');
    var files = Object.keys(this.files);
    var method = params.request;
    delete params.request;

    var content = [];
    // content.push({
    //   'argument': "-obs",
    //   'endpoint': 'datasets',
    //   'metadata': {
    //     "datasetName": this.files['-obs'].name,
    //     "missing": this.file.missing,
    //     "discrete": this.file.discrete
    //   },
    //   'file': this.files['-obs']
    // });

    delete params['-obs'];
    delete params['-inf'];
    delete params['-obsStatic'];

    files.forEach(key => {
      if(method != 'isdtDBN' && key == '-inf') return;
      content.push({
        'argument': key,
        'endpoint': 'others',
        'metadata': {
          "datasetName": this.files[key].name,
        },
        'file': this.files[key],
      });
    });

    var notification = params.notification
    delete params.notification;
    var requestName = params.requestName;
    delete params.requestName;

    this.datasetService.batchFileUpload(content).subscribe(ids => {
      let inputFiles = { "-fromFile": this.data['files']['dbn.ser']['datasetId'] };
      content.forEach((element, i) => inputFiles[element["argument"]] = ids[i]);
      this.datasetService.postRequest(method, {
        "inputFiles": inputFiles,
        // TODO: should be params?
        "params": this.form.value,
        "requestName": requestName,
        "notification": notification
      }).subscribe(requestId => this.resultId = requestId)
    });

    return;
  }
}
