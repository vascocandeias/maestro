import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-learn-sdtdbn-method',
  templateUrl: './learn-sdtdbn-method.component.html',
  styleUrls: ['./learn-sdtdbn-method.component.css']
})
export class LearnSdtdbnMethodComponent implements OnInit {
  @Input() datasetId: string;
  @Input() datasetName: string;

  form: FormGroup;
  files = {};
  constructor(
    private router: Router,
    private datasetService: DatasetService,
  ) { }

  ngOnInit() {
    var requestName = this.datasetName ? this.datasetName.split(".csv")[0] + "_modeling" : "";
    this.form = new FormGroup({
      "-s": new FormControl('mdl', [Validators.required]),
      "-ns": new FormControl(true),
      "-sp": new FormControl(false),
      "-b": new FormControl(2, [Validators.max(9999), Validators.min(0)]),
      "-m": new FormControl(1, [Validators.required, Validators.max(9999), Validators.min(1)]),
      "-p": new FormControl(1, [Validators.required, Validators.max(9999), Validators.min(1)]),
      "notification": new FormControl(true),
      "requestName": new FormControl(requestName, [Validators.required])
    });
  }

  ngOnChanges() {
    if(!this.form) return;
    if(!this.form.value.requestName && this.datasetName)
      this.form.value.requestName = this.datasetName.split(".csv")[0] + "_modeling";
  }

  add(event) {
    event.stopPropagation();
    event.preventDefault();
    event.srcElement.parentElement.children["-" + event.srcElement.id].click();
    // document.getElementById("-" + event.srcElement.id).click();
    event.srcElement.blur();
  }

  value(id) {
    return this.files[id] ? this.files[id].name : '';
  }
  
  removeFocus(event) {
    event.preventDefault();
    event.srcElement.blur();
    console.log(event);
  }

  handleFile(event) {
    delete this.files[event.srcElement.id];
    this.files[event.srcElement.id] = event.target.files[0];
    event.target.value = "";
  }

  clear(file) {
    // TODO: fix below
    event.stopPropagation();
    event.preventDefault();
    delete this.files[file];
  }

  request() {
    this.form.value["-ns"] = !this.form.value["-ns"];
    console.log(this.form);
    console.log(this.files);
    if(!this.files['-is']) {
      delete this.form.value['-b'];
      delete this.files['-mA_static'];
      delete this.files['-mNotA_static'];
    }

    var content = [];
    Object.entries(this.files).forEach(([key, value]) => {
      content.push({
        'argument': key,
        'endpoint': 'others',
        'metadata': {
          "datasetName": value['name'],
        },
        'file': value
      })
    })
    
    var notification = this.form.value.notification;
    delete this.form.value.notification;
    var requestName = this.form.value.requestName;
    delete this.form.value.requestName;

    let request = {
      "inputFiles": {"-i": this.datasetId },
      "params": this.form.value,
      "requestName": requestName,
      "notification": notification
    };

    if(content.length != 0) this.datasetService.batchFileUpload(content).subscribe(ids => {
      console.log("Output", ids)
      content.forEach((element, i) => request.inputFiles[element["argument"]] = ids[i]);
      console.log("request", request);
      this.datasetService.postRequest("learnsdtDBN", request).subscribe(requestId =>
        this.router.navigate(['/results/' + requestId])
      )
    });
    else this.datasetService.postRequest("learnsdtDBN", request).subscribe(requestId =>
      this.router.navigate(['/results/' + requestId])
    );
  }
}
