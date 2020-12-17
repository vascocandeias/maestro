import { Component, OnInit, Input } from '@angular/core';
import { GraphModel } from 'src/app/data/data.model';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-result-learn-dbn',
  templateUrl: './learn-dbn.component.html',
  styleUrls: ['./learn-dbn.component.css']
})
export class LearnDBNComponent implements OnInit {
  @Input() data: any;

  file = {    
      dataset: null,
      missing: false,
      discrete: true,
      datasetId: "",
      datasetName: "",
      final: false
  }
  
  network: GraphModel;

  constructor(private datasetService: DatasetService) { }

  ngOnInit() {
    this.handleNetwork();
    this.handleCSV();
  }

  open() {
    document.getElementById("panel").style.overflow = "inherit";
  }

  close() {
    document.getElementById("panel").style.overflow = "hidden";
  }

  handleNetwork(){
    console.log("learnDBN", this.data);
    this.datasetService.getFile(this.data["files"]["dbn.json"].datasetId)
      .subscribe(result => this.network = JSON.parse(result));
  }

  downloadText() {
    this.datasetService.downloadFile(this.data["files"]["dbn.txt"].datasetId, "network.txt");
  }

  handleCSV(){
    this.file.datasetId = this.data["files"]["imputed.csv"]["datasetId"];
    this.file.datasetName = this.data["files"]["imputed.csv"]["datasetName"];
    this.datasetService.getFile(this.file.datasetId)
      .subscribe(result => this.file.dataset = result);
  }
}
