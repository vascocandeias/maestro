import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
// import { MatBottomSheet } from "@angular/material/bottom-sheet";
// import { CountryCodeSelectComponent } from "../country-code-select/country-code-select.component";
// import { CountryCode } from "../country-code-select/country-codes";
import { AuthService } from "../auth.service";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"]
})
export class SignUpComponent implements OnInit {
  hide = true;
  signupForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.email, Validators.required]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)])
  });

  get emailInput() {
    return this.signupForm.get("email");
  }
  get passwordInput() {
    return this.signupForm.get("password");
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {}

  getEmailInputError() {
    if (this.emailInput.hasError("email")) {
      return "Please enter a valid email address.";
    }
    if (this.emailInput.hasError("required")) {
      return "An Email is required.";
    }
  }

  getPasswordInputError() {
    if (this.passwordInput.hasError("required")) {
      return "A password is required.";
    }
    if (this.passwordInput.hasError("minlength")) {
      return "The password must contain at least 8 characters.";
    }
  }

  shouldEnableSubmit() {
    return (
      !this.emailInput.valid ||
      !this.passwordInput.valid
    );
  }

  signUp() {
    this.authService
      .signUp({
        email: this.emailInput.value,
        password: this.passwordInput.value
      })
      .then(data => {
        environment.confirm.email = this.emailInput.value;
        environment.confirm.password = this.passwordInput.value;
        this.router.navigate(["auth/confirm"]);
      })
      .catch(error => console.log(error));
  }
}
