import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-general-method',
  templateUrl: './general-method.component.html',
  styleUrls: ['./general-method.component.css']
})
export class GeneralMethodComponent implements OnInit {
  @Input() datasetId: string;
  @Input() datasetName: string;
  @Input() method: string;

  form: FormGroup;
  files = {};
  template: any;

  constructor(
    private router: Router,
    private datasetService: DatasetService,
  ) { }

  ngOnInit(): void {
    var requestName = this.datasetName && this.method ? this.datasetName.split(".csv")[0] + "_" + this.method : "";
    this.form = new FormGroup({
      "notification": new FormControl(true),
      "requestName": new FormControl(requestName, [Validators.required])
    });
    if(this.method && !this.template) this.getMethod();
  }

  ngOnChanges() {
    if(!this.form) return;
    if(this.method && !this.template) this.getMethod();
    if(!this.form.value.requestName && this.datasetName && this.method)
      this.form.value.requestName = this.datasetName.split(".csv")[0] + "_" + this.method;
  }


  add(event) {
    event.stopPropagation();
    event.preventDefault();
    event.srcElement.parentElement.children[event.srcElement.id.substring(1)].click();
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

  getMethod() {
    this.datasetService.getMethod(this.method).subscribe(template => {
      for(let key in template.checkboxes)
        this.form.addControl(key, new FormControl(false));
      for(let key in template.fields)
        this.form.addControl(key, new FormControl(template.fields[key].value));
      for(let key in template.options)
        this.form.addControl(key, new FormControl(template.options[key].values[0]));
      this.template = template;
    });
  }

  request() {
    console.log(this.form)
    console.log(this.files);

    if(this.template.options.type) {
      this.form.value[this.form.value.type] = true;
      delete this.form.value.type;
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
      "inputFiles": {},
      "params": this.form.value,
      "requestName": requestName,
      "notification": notification
    };

    request.inputFiles[this.template.mainFile.name] = this.datasetId

    if(content.length != 0) this.datasetService.batchFileUpload(content).subscribe(ids => {
      console.log("Output", ids)
      content.forEach((element, i) => request.inputFiles[element["argument"]] = ids[i]);
      console.log("request", request);
      this.datasetService.postRequest(this.method, request).subscribe(requestId =>
        this.router.navigate(['/results/' + requestId])
      )
    });
    else this.datasetService.postRequest(this.method, request).subscribe(requestId =>
      this.router.navigate(['/results/' + requestId])
    );
  }

  typeof = (value) => typeof(value);
}
