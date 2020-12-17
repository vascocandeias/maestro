import { Component, OnInit } from '@angular/core';
import { DatasetService } from '../services/dataset.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  results: []

  constructor(
    private datasetService: DatasetService
  ) {}

  ngOnInit() {
    // if(Auth.)
    this.getResults();
  }

  getResults(){
    this.results = null;
    this.datasetService.getResults().subscribe(data => { console.log(data); this.results = data});
  }
  
  delete(result: any){
    this.datasetService.deleteResult(result.requestId).subscribe(result => {console.log(result); this.getResults()});
  }
}
