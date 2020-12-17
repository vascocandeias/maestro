import { Component, HostListener, OnInit } from '@angular/core';
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, max, min, shareReplay } from 'rxjs/operators';

export interface MethodCard {
  name?: string,
  description?: string,
  icon?: string,
  link?: string
};

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})

export class LandingComponent implements OnInit {

  methods: MethodCard[] = [
    {
      name: "Discretization",
      description: "Use equal width (EQW) or equal frequency (EQF) bins to discretize continuous data.",
      icon: "timeline",
      link: "https://www.mybytes.de/papers/moerchen05optimizing.pdf"
    },
    {
      name: "DBN Imputation",
      description: "Learn a DBN and use it to predict and fill missing data.",
      icon: "add_circle_outline",
      link: "https://ssamdav.github.io/learnDBN/"
    },
    {
      name: "Simple Imputation",
      description: "Fill missing data by repeating the previous value (Last Observation Carried Forward) or by fitting a linear function (Linear Regression).",
      icon: "add_circle_outline",
      link: "https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0111964&type=printable"
    },
    {
      name: "Outlier Detection",
      description: "Detect outliers by learning a DBN and using it to score each datapoint.",
      icon: "remove_circle_outline",
      link: "https://jorgeserras.com/MTS_OutlierDetection/"
    },
    {
      name: "Clustering",
      description: "Find clusters of subjects by learning DBN models and determining who fits each network better.",
      icon: "bubble_chart",
      link: "https://ssamdav.github.io/learnDBM/"
    },
    {
      name: "Modeling",
      description: "Learn a DBN model with both dynamic and static attributes to use for prediction.",
      icon: "model_training",
      link: "https://ttlion.github.io/sdtDBN/"
    },
    {
      name: "Prediction",
      description: "Use a learnt DBN to predict attributes in future timestamps.",
      icon: "online_prediction",
      link: "https://ttlion.github.io/sdtDBN/"
    }
  ]

  faGithub = faGithub;
  faLinkedin = faLinkedinIn;
  width: number;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.width = Math.max(200, Math.min(260, event.target.innerWidth - 170));
  }

  isSmall$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 720px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit() {
    this.width = Math.max(200, Math.min(260, window.innerWidth - 170));
  }
}