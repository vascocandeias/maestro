import { Component, OnInit } from '@angular/core';

// import { Auth } from 'aws-amplify';
import { DatasetService } from '../services/dataset.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UploadDialogComponent } from '../upload-dialog/upload-dialog.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  fileUrl: any;

  form: FormGroup;
  error = false;

  file = {    
      dataset: null,
      missing: false,
      discrete: false,
      datasetId: "",
      datasetName: ""
  }

  examples: {} = {};

  sections: string[] = [];

  order = ["imputation", "outlier detection", "clustering", "modeling", "prediction"];

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private datasetService: DatasetService
    ) { }

  ngOnInit() {
    this.datasetService.getExamples().subscribe(examples => {
      if(!examples) return;
      examples.forEach(element => {
        if(!this.examples[element["method"]]) {
          this.examples[element["method"]] = [];
          this.sections.push(element["method"]);
        }
        this.examples[element["method"]].push(element["name"]);
      });
      this.sections.sort((a, b) => this.order.indexOf(a) - this.order.indexOf(b));
    });
    // TODO: remove
    // Auth.currentSession().then(res=>{
    //   let accessToken = res.getIdToken()
    //   let jwt = accessToken.getJwtToken()
    //   //You can print them to see the full objects
    //   console.log(`myAccessToken: ${JSON.stringify(accessToken)}`)
    //   console.log(`myJwt: ${jwt}`)
    // })
    this.form = new FormGroup({
      "file": new FormControl('', [Validators.required]),
    });
  }


  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  download(exampleId: string) {
    this.datasetService.getExample(exampleId).subscribe(result => {
      this.datasetService.download(result, exampleId)
    });
  }
  
  onDragOver(event) {
    event.preventDefault();
    document.getElementById("drop").classList.add("active");
  }

  onDragLeave(event) {
    event.preventDefault();
    document.getElementById("drop").classList.remove("active");
  }

  onDropSuccess(event) {
    event.preventDefault();
    document.getElementById("drop").classList.remove("active");
    this.form.controls.file.setErrors({required:true});
    this.handleFile(event, event.dataTransfer.files);
  }

  add(event) {
    console.log("adding");
    this.form.value.file = "";
    console.log(this.form.value.file)
    event.preventDefault();
    this.form.controls.file.setErrors({required:true});
    document.getElementById("input-csv").click();
  }

  handleFile(event, file) {
    if(file[0] && file[0].name.split('.').pop() != 'csv') return;
    this.form.value.file = file[0] ? file[0].name : file[0];
    this.file.dataset = file[0]
    if(!file[0]) return;
    // this.form.controls.file.updateValueAndValidity();
    console.log("handleFile", this.form)
    this.form.controls.file.setErrors(null);
    console.log("handleFile", this.form.value.file)
    event.target.value = ""
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      data: {
        file: this.file
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // TODO: missing and discrete or remove file
    });
  }
}
