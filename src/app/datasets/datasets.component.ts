import { Component, OnInit } from '@angular/core';
import { DatasetService } from '../services/dataset.service';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.css']
})
export class DatasetsComponent implements OnInit {

  datasets: [];

  constructor(
    private datasetService: DatasetService
  ) {}

  ngOnInit() {
    // if(Auth.)
    this.getDatasets();
  }

  getDatasets(){
    this.datasetService.getDatasets().subscribe(data => this.datasets = data);
  }

  delete(dataset: any){
    this.datasets = null;
    this.datasetService.deleteDataset(dataset.datasetId).subscribe(result => {console.log(result); this.getDatasets()});
  }

  onCardClick() {
    console.log("card");
  }
}
