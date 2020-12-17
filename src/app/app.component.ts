import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'maestro';
  headerText: string;
  formFields: {}[];

  constructor(public router: Router, public auth: AuthService) {
    this.formFields = [
      {
        type: 'email',
        required: true,
      },
      {
        type: 'password',
        required: true,
      },
    ]
  }

  ngOnInit() {
    this.auth.init();
  }
}
