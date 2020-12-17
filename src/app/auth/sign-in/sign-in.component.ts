import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoaderService } from 'src/app/loader/loader.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  
  signinForm: FormGroup = new FormGroup({
    email: new FormControl('',[Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  
  hide = true;

  get emailInput() { return this.signinForm.get('email'); }
  get passwordInput() { return this.signinForm.get('password'); }

  constructor( 
    public auth: AuthService, 
    private notification: NotificationService, 
    private router: Router,
    private loader: LoaderService ) { }

  getEmailInputError() {
    if (this.emailInput.hasError('email')) {
      return 'Please enter a valid email address.';
    }
    if (this.emailInput.hasError('required')) {
      return 'An Email is required.';
    }
  }

  getPasswordInputError() {
    if (this.passwordInput.hasError('required')) {
      return 'A password is required.';
    }
  }

  signIn() {
    this.loader.show();
    this.auth.signIn(this.emailInput.value, this.passwordInput.value)
      .then((user: any) => {
        this.loader.hide();
        this.router.navigate(['/upload']);
      })
      .catch((error: any) => {
        this.loader.hide();
        this.notification.show(error.message);
        console.log(error)
        switch (error.code) {
          case "UserNotConfirmedException":
            environment.confirm.email = this.emailInput.value;
            environment.confirm.password = this.passwordInput.value;
            this.router.navigate(['auth/confirm']);
            break;
          case "UsernameExistsException":
            this.router.navigate(['auth/signin']);
            break;
        }
      })
  }
}