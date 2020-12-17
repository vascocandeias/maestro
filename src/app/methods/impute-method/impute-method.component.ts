import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatasetService } from 'src/app/services/dataset.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-impute-method',
  templateUrl: './impute-method.component.html',
  styleUrls: ['./impute-method.component.css']
})
export class ImputeMethodComponent implements OnInit {
  @Input() datasetId: string;
  @Input() discrete: any;
  @Input() datasetName: string;

  forms = new FormArray([]);

  selectedTabIndex = 0;

  constructor(
    private router: Router,
    private datasetService: DatasetService,
  ) { }

  ngOnInit() {
    var requestName = this.datasetName ? this.datasetName.split(".csv")[0] + "_imputation" : "";
    if(this.isBoolean(this.discrete)) {
      this.forms.push(new FormGroup({
        "type": new FormControl('tDBN', [Validators.required]),
        "-ns": new FormControl(true),
        "-sp": new FormControl(false),
        "-ind": new FormControl(1, [Validators.required, Validators.max(9999), Validators.min(0)]),
        "-m": new FormControl(1, [Validators.required, Validators.max(9999), Validators.min(1)]),
        "-p": new FormControl(1, [Validators.required, Validators.max(9999), Validators.min(1)]),
        "notification": new FormControl(true),
        "requestName": new FormControl(requestName, [Validators.required])
      }));
    }
    this.forms.push(new FormGroup({
      "method": new FormControl('locf', [Validators.required]),
      "notification": new FormControl(true),
      "requestName": new FormControl(requestName, [Validators.required])
    }));
    console.log("forms", this.forms);
  }

  ngOnChanges() {
    if(!this.forms) return;
    this.forms.controls.forEach(form => {
      if(form.value.requestName && this.datasetName)
        form.value.requestName = this.datasetName.split(".csv")[0] + "_imputation";
    })
  }

  isBoolean(val): boolean { return typeof val === 'boolean'; }

  request() {
    if(this.forms.controls.length == 1 || this.selectedTabIndex) 
      this.simpleRequest();
    else
      this.dbnRequest();
  }

  simpleRequest() {
    var form = this.forms.controls.length == 1 ? this.forms.controls[0] : this.forms.controls[1];

    var notification = form.value.notification;
    delete form.value.notification;
    var requestName = form.value.requestName;
    delete form.value.requestName;

    this.datasetService.postRequest(form.value.method, {
      "inputFiles": { "-i": this.datasetId },
      "params": {},
      "requestName": requestName,
      "notification": notification
    }).subscribe(requestId => this.router.navigate(['/results/' + requestId]));
  }

  dbnRequest() {
    var form = this.forms.controls[0];
    form.value["-ns"] = !form.value["-ns"];
    form.value["-" + form.value.type] = true;
    delete form.value.type;

    var notification = form.value.notification;
    delete form.value.notification;
    var requestName = form.value.requestName;
    delete form.value.requestName;

    this.datasetService.postRequest("learnDBN", {
      "inputFiles": { "-i": this.datasetId },
      "params": form.value,
      "requestName": requestName,
      "notification": notification
    }).subscribe(requestId => this.router.navigate(['/results/' + requestId]));
  }
}