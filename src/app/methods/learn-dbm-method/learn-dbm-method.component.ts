import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DatasetService } from 'src/app/services/dataset.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-learn-dbm-method',
  templateUrl: './learn-dbm-method.component.html',
  styleUrls: ['./learn-dbm-method.component.css']
})
export class LearnDbmMethodComponent implements OnInit {
  @Input() datasetId: string;
  @Input() datasetName: string;

  form: FormGroup;

  constructor(
    private router: Router,
    private datasetService: DatasetService,
  ) { }

  ngOnInit() {
    var requestName = this.datasetName ? this.datasetName.split(".csv")[0] + "_clustering" : "";
    this.form = new FormGroup({
      "type": new FormControl('tDBN', [Validators.required]),
      "-ns": new FormControl(true),
      "-sp": new FormControl(false),
      "-ind": new FormControl(1, [Validators.required, Validators.max(9999), Validators.min(0)]),
      "-m": new FormControl(1, [Validators.required, Validators.max(9999), Validators.min(1)]),
      "-k": new FormControl(2, [Validators.required, Validators.max(9999), Validators.min(1)]),
      "-p": new FormControl(1, [Validators.required, Validators.max(9999), Validators.min(1)]),
      "notification": new FormControl(true),
      "requestName": new FormControl(requestName, [Validators.required])
    });
  }

  ngOnChanges() {
    if(!this.form) return;
    if(!this.form.value.requestName && this.datasetName)
      this.form.value.requestName = this.datasetName.split(".csv")[0] + "_clustering";
  }

  request() {
    this.form.value["-ns"] = !this.form.value["-ns"];
    this.form.value["-" + this.form.value.type] = true;
    delete this.form.value.type;
    
    var notification = this.form.value.notification;
    delete this.form.value.notification;
    var requestName = this.form.value.requestName;
    delete this.form.value.requestName;

    this.datasetService.postRequest("learnDBM", {
      "inputFiles": { "-i": this.datasetId },
      "params": this.form.value,
      "requestName": requestName,
      "notification": notification
    }).subscribe(requestId => this.router.navigate(['/results/' + requestId]));
  }
}