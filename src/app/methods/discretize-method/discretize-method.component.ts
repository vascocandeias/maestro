import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-discretize-method',
  templateUrl: './discretize-method.component.html',
  styleUrls: ['./discretize-method.component.scss']
})
export class DiscretizeMethodComponent implements OnInit {
  @Input() datasetId: string;
  @Input() datasetName: string;
  @Input() discrete: string[] | boolean;

  form: FormGroup;

  constructor(
    private router: Router,
    private datasetService: DatasetService,
  ) { }

  ngOnInit() {
    var requestName = this.datasetName ? this.datasetName.split(".csv")[0] + "_discretization" : "";
    this.form = new FormGroup({
      "method": new FormControl("eqw", [Validators.required]),
      "-n": new FormControl(2, [Validators.required, Validators.max(8), Validators.min(1)]),
      "notification": new FormControl(true),
      "requestName": new FormControl(requestName, [Validators.required])
    });
  }

  ngOnChanges() {
    if(!this.form) return;
    if(!this.form.value.requestName && this.datasetName)
      this.form.value.requestName = this.datasetName.split(".csv")[0] + "_discretization";
  }

  request() {
    let discrete = typeof this.discrete === "boolean" ? [] : this.discrete;

    this.datasetService.postRequest(this.form.value.method, {
      "inputFiles": { "-i": this.datasetId },
      "params": {'-n': this.form.value['-n'], "-d": discrete.join(" ")},
      "requestName": this.form.value.requestName,
      "notification": this.form.value.notification
    }).subscribe(requestId => this.router.navigate(['/results/' + requestId]));
  }}
