import { Component, Input, OnInit } from '@angular/core';
import { GraphModel } from 'src/app/data/data.model';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-result-general-result',
  templateUrl: './general-result.component.html',
  styleUrls: ['./general-result.component.css']
})
export class GeneralResultComponent implements OnInit {
  @Input() data: any;

  network: GraphModel;
  networks: GraphModel[];
  
  constructor(private datasetService: DatasetService) { }

  ngOnInit(): void {
    if(this.data["files"]["dbn.json"]) this.handleNetworks();
  }

  handleNetworks(){
    this.datasetService.getFile(this.data["files"]["dbn.json"].datasetId)
      .subscribe(result => {
        let r = JSON.parse(result);
        
        if(Array.isArray(r)) {
          this.networks = [];
          r.forEach((element: any, i: number) => {
            this.networks[i] = element.data;
            this.networks[i].alpha = element.alpha;
          });
        }
        else this.network = r;
      });
  }

  downloadText() {
    this.datasetService.downloadFile(this.data["files"]["dbn.txt"].datasetId, "networks.txt");
  }
}
