import { Component, OnInit, Input } from '@angular/core';
import { GraphModel } from 'src/app/data/data.model';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-result-learn-dbm',
  templateUrl: './learn-dbm.component.html',
  styleUrls: ['./learn-dbm.component.css']
})
export class LearnDbmComponent implements OnInit {
  @Input() data: any;

  networks: GraphModel[] = [];

  constructor(private datasetService: DatasetService) { }

  ngOnInit() {
    this.handleNetworks();
  } 
  
  handleNetworks(){
    this.datasetService.getFile(this.data["files"]["dbn.json"].datasetId)
      .subscribe(result => {
        // console.log("result", result);
        JSON.parse(result).forEach((element: any, i: number) => {
          this.networks[i] = element.data;
          this.networks[i].alpha = element.alpha;
        });
        // console.log(this.networks);
      });
  }
  
  downloadText() {
    this.datasetService.downloadFile(this.data["files"]["dbn.txt"].datasetId, "networks.txt");
  }

  downloadClusters() {
    this.datasetService.downloadFile(this.data["files"]["clusters.csv"].datasetId, "clusters.csv");
  }
}
