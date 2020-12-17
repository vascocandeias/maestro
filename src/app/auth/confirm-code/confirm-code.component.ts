import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import Auth from '@aws-amplify/auth';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-confirm-code',
  templateUrl: './confirm-code.component.html',
  styleUrls: ['./confirm-code.component.scss']
})
export class ConfirmCodeComponent implements OnInit {

  email = environment.confirm.email;
  confirmForm: FormGroup = new FormGroup({
    email: new FormControl({value: this.email, disabled: true}),
    code: new FormControl('', [Validators.required, Validators.min(3)])
  });
  
  get codeInput() { return this.confirmForm.get('code'); }

  constructor(
    private router: Router,
    public auth: AuthService,
    private notification: NotificationService
  ) { }

  ngOnInit() {
    if (!this.email) {
      this.router.navigate(['auth/signup']);
    }
  }

  sendAgain() {
    this.auth.sendAgain(this.email)
      .then(() => this.notification.show('A code has been emailed to you'))
      .catch(() => this.notification.show('An error occurred'));;
  }

  confirmCode() {
    this.auth.confirm(this.email, this.codeInput.value)
      .then((data: any) => {
        console.log(data);
        if (data === 'SUCCESS' &&
            environment.confirm.email && 
            environment.confirm.password) {
          this.auth.signIn(this.email, environment.confirm.password)
            .then(() => {
              this.router.navigate(['upload']);
            }).catch((error: any) => {
              this.router.navigate(['auth/signin']);
            })
        }
      })
      .catch((error: any) => {
        this.notification.show(error.message);
      })
  }

}