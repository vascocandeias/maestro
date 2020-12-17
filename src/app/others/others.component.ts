import { Component, OnInit } from '@angular/core';
import { DatasetService } from '../services/dataset.service';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.css']
})
export class OthersComponent implements OnInit {

  others: [];

  constructor(
    private datasetService: DatasetService
  ) {}

  ngOnInit() {
    this.getOthers();
  }

  getOthers() {
    this.others = null;
    this.datasetService.getOthers().subscribe(data => this.others = data);
  }
  
  delete(other: any) {
    this.datasetService.deleteOther(other.datasetId).subscribe(result => {console.log(result); this.getOthers()});
  }

  download(other: any) {
    this.datasetService.downloadFile(other.datasetId, other.datasetName);
  }
}

