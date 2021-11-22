import { Component, OnInit } from '@angular/core';
import { DatasetService } from '../services/dataset.service';

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styleUrls: ['./networks.component.css']
})
export class NetworksComponent implements OnInit {

  networks: [];

  constructor(
    private datasetService: DatasetService
  ) {}

  ngOnInit() {
    this.getNetworks();
  }

  getNetworks(){
    this.networks = null;
    this.datasetService.getNetworks().subscribe(data => this.networks = data);
  }
  
  delete(network: any){
    this.datasetService.deleteNetwork(network.requestId).subscribe(result => {console.log(result); this.getNetworks()});
  }
}
