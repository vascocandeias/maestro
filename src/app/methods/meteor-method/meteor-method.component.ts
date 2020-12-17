import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DatasetService } from 'src/app/services/dataset.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-meteor-method',
  templateUrl: './meteor-method.component.html',
  styleUrls: ['./meteor-method.component.css']
})
export class MeteorMethodComponent implements OnInit {
  @Input() datasetId: string;
  @Input() datasetName: string;

  form: FormGroup;

  constructor(
    private router: Router,
    private datasetService: DatasetService,
  ) { }

  ngOnInit() {
    var requestName = this.datasetName ? this.datasetName.split(".csv")[0] + "_outliers" : "";
    this.form = new FormGroup({
      "-s": new FormControl('mdl', [Validators.required]),
      "-ns": new FormControl(true),
      "-m": new FormControl(1, [Validators.required, Validators.max(9999), Validators.min(1)]),
      "-p": new FormControl(1, [Validators.required, Validators.max(9999), Validators.min(1)]),
      "notification": new FormControl(true),
      "requestName": new FormControl(requestName, [Validators.required])
    });
  }

  ngOnChanges() {
    if(!this.form) return;
    if(!this.form.value.requestName && this.datasetName)
      this.form.value.requestName = this.datasetName.split(".csv")[0] + "_outliers";
  }

  request() {
    this.form.value["-ns"] = !this.form.value["-ns"];
    console.log(this.form);

    var notification = this.form.value.notification;
    delete this.form.value.notification;
    var requestName = this.form.value.requestName;
    delete this.form.value.requestName;

    this.datasetService.postRequest("meteor", {
      "inputFiles": { "-i": this.datasetId },
      "params": this.form.value,
      "requestName": requestName,
      "notification": notification
    }).subscribe(requestId => this.router.navigate(['/results/' + requestId]));
  }
}