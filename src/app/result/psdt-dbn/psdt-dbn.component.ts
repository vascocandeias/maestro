import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-result-psdt-dbn',
  templateUrl: './psdt-dbn.component.html',
  styleUrls: ['./psdt-dbn.component.css']
})
export class PsdtDBNComponent implements OnChanges {

  @Input() data: any;
  result: { dataset: any; missing: boolean; discrete: boolean; datasetId: any; datasetName: any; final: boolean; };

  constructor(private datasetService: DatasetService) { }

  ngOnChanges() {
    this.handleCsv();
  }

  handleCsv() {
    this.datasetService.getFile(this.data.files["trajectories.csv"].datasetId).subscribe(result => {
      this.result = {    
        dataset: result,
        missing: false,
        discrete: true,
        datasetId: this.data.files["trajectories.csv"].datasetId,
        datasetName: this.data.files["trajectories.csv"].datasetName,
        final: true
      }
    })
  }
}
