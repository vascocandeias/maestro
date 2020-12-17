import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResultComponent } from './result/result.component';
import { UploadComponent } from './upload/upload.component';
import { ResultsComponent } from './results/results.component';
import { DatasetsComponent } from './datasets/datasets.component';
import { TimeSeriesComponent } from './time-series/time-series.component';
import { NetworksComponent } from './networks/networks.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { UnauthGuard } from './auth/unauth.guard';
import { ConfirmCodeComponent } from './auth/confirm-code/confirm-code.component';
import { AuthGuard } from './auth/auth.guard';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { LandingComponent } from './landing/landing.component';
import { OthersComponent } from './others/others.component';


const routes: Routes = [
  {
    path: 'auth', children: [
      {
          path: '',
          pathMatch: 'full',
          redirectTo: 'signin'
      },
      {
        path: 'signin',
        component: SignInComponent,
        canActivate: [UnauthGuard]
      },
      {
        path: 'signup',
        component: SignUpComponent,
        canActivate: [UnauthGuard]
      },
      {
        path: 'confirm',
        component: ConfirmCodeComponent,
        canActivate: [UnauthGuard]
      }
    ]
  },
  { path: '', component: LandingComponent },
  { path: 'dashboard', redirectTo: '/upload', pathMatch: 'full' },
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
  { path: 'datasets', component: DatasetsComponent, canActivate: [AuthGuard] },
  { path: 'results', component: ResultsComponent, canActivate: [AuthGuard] },
  { path: 'networks', component: NetworksComponent, canActivate: [AuthGuard] },
  { path: 'others', component: OthersComponent, canActivate: [AuthGuard] },
  { path: 'results/:resultid', component: ResultComponent, canActivate: [AuthGuard] },
  { path: 'datasets/:datasetid', component: TimeSeriesComponent, canActivate: [AuthGuard] },
  { path: 'networks/:resultid', component: ResultComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
