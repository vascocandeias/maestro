import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule }    from '@angular/common/http';

import { UploadComponent } from './upload/upload.component';
import { TimeSeriesComponent } from './time-series/time-series.component';
import { HeatmapComponent } from './heatmap/heatmap.component';

// Two-way binding
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Interceptor
import { httpInterceptProviders } from './http-interceptors';

// My components
import { ResultComponent } from './result/result.component';
import { LearnDBNComponent } from './result/learn-dbn/learn-dbn.component';
import { NetworkComponent } from './network/network.component';
import { LearnDbmComponent } from './result/learn-dbm/learn-dbm.component';
import { ResultsComponent } from './results/results.component';
import { DatasetsComponent } from './datasets/datasets.component';
import { MeteorComponent } from './result/meteor/meteor.component';
import { HistogramComponent } from './histogram/histogram.component';
import { NetworksComponent } from './networks/networks.component';
import { ModelComponent } from './model/model.component';
import { IsdtDBNComponent } from './result/isdt-dbn/isdt-dbn.component';
import { PsdtDBNComponent } from './result/psdt-dbn/psdt-dbn.component';
import { MainNavComponent } from './main-nav/main-nav.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MeteorMethodComponent } from './methods/meteor-method/meteor-method.component';
import { ImputeMethodComponent } from './methods/impute-method/impute-method.component';
import { LearnDbmMethodComponent } from './methods/learn-dbm-method/learn-dbm-method.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { LearnSdtdbnMethodComponent } from './methods/learn-sdtdbn-method/learn-sdtdbn-method.component';
import { DiscretizeMethodComponent } from './methods/discretize-method/discretize-method.component';
import { LoaderComponent } from './loader/loader.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ConfirmCodeComponent } from './auth/confirm-code/confirm-code.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LandingComponent } from './landing/landing.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatStepperModule } from '@angular/material/stepper';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { OthersComponent } from './others/others.component';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GeneralMethodComponent } from './methods/general-method/general-method.component';
import { GeneralResultComponent } from './result/general-result/general-result.component';


@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    TimeSeriesComponent,
    HeatmapComponent,
    ResultComponent,
    LearnDBNComponent,
    NetworkComponent,
    LearnDbmComponent,
    ResultsComponent,
    DatasetsComponent,
    MeteorComponent,
    HistogramComponent,
    NetworksComponent,
    ModelComponent,
    IsdtDBNComponent,
    PsdtDBNComponent,
    MainNavComponent,
    MeteorMethodComponent,
    ImputeMethodComponent,
    LearnDbmMethodComponent,
    LearnSdtdbnMethodComponent,
    DiscretizeMethodComponent,
    LoaderComponent,
    SignInComponent,
    SignUpComponent,
    ConfirmCodeComponent,
    LandingComponent,
    BarChartComponent,
    OthersComponent,
    UploadDialogComponent,
    GeneralMethodComponent,
    GeneralResultComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatTabsModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatDialogModule,
    MatSnackBarModule,
    IvyCarouselModule,
    FontAwesomeModule,
    MatStepperModule,
    FlexLayoutModule
  ],
  providers: [httpInterceptProviders],
  bootstrap: [AppComponent],
  entryComponents: [
    LoaderComponent,
    UploadDialogComponent
  ]
})
export class AppModule { }

