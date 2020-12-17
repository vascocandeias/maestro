import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatasetService } from '../services/dataset.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnChanges {
  @Input() resultId: string;

  data: any;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private datasetService: DatasetService
  ) {}

  ngOnInit() {
    console.log("ngOnInit", this.resultId);
    if(!this.resultId) this.ngOnChanges();
  }

  ngOnChanges() {
    if(this.resultId) this.getResult(this.resultId);
    else this.route.params.subscribe(params => {
      this.data = undefined;
      this.getResult(params['resultid']);
    });
    // const resultId = this.resultId ? this.resultId : this.route.snapshot.paramMap.get('resultid');
    // console.log("still", resultId);
    // this.getResult(resultId);
  }

  getResult(resultId: string){
    this.data = null;
    this.datasetService.getResult(resultId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        console.log("data", data);
        // TODO: decide what to do. ask to retry?
        data? this.data = data : this.getResult(resultId);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
  }
}
