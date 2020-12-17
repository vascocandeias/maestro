import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DatasetService } from '../services/dataset.service';

export interface NewUser {
  email: string,
  password: string,
};

const AUTH_URL = environment.api + '/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private jwt: JwtHelperService = new JwtHelperService();
  private _loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.getAuth());
  httpClient: HttpClient;

  get isLoggedIn() {
    return this._loggedIn.asObservable();
  }

  constructor(
    private datasetService: DatasetService,
    private http: HttpClient,
  ) { }

  private loginHandler(error: HttpErrorResponse) {
    console.log(error);
    if (error.error == "Could not verify")
      return throwError({code: "NotAuthorizedException", name: "NotAuthorizedException", message: "Incorrect username or password."})
    else if(error.error == "User not confirmed")
      return throwError({code: "UserNotConfirmedException", name: "UserNotConfirmedException", message: "User is not confirmed."})
   return throwError(error);
  }

  // Handle authentication errors
  private errorHandler(error: HttpErrorResponse) {
    console.log(error)
    if (error.error instanceof ErrorEvent)
      console.error(`authentication error: ${error.error.message}`);
    else if(error.error == "Wrong code!")
      return throwError({code: "CodeMismatchException", name: "CodeMismatchException", message: "Invalid verification code provided, please try again."})
    else
      console.error(`bad auth response: ${error.status}: ${error.statusText} ${JSON.stringify(error.error)}`);
    return throwError('Login attempt failed');
  }

  // subscribe to get authentication status updates
  subscribe(next: (status: boolean) => void) {
    this._loggedIn.subscribe(next);
  }

  signUp(user: NewUser): Promise<any> {
    return this.http.post<any>(AUTH_URL + '/signup', { "mail": user.email, "password": user.password })
      .pipe(
        tap(response => {
          console.log(response);
        }),
        catchError(this.errorHandler)
      ).toPromise();
  }

  confirm(email, code): Promise<any> {
    return this.http.post<any>(AUTH_URL + '/confirm', { "mail": email, "code": code }).pipe(
      map(response => response.message),
      catchError(this.errorHandler)
    ).toPromise();
  }

  // Log user in and get refresh/access tokens
  signIn(mail: string, password: string) {
    console.log(AUTH_URL)
    return this.http.post<any>(AUTH_URL + '/login', { "mail": mail, "password": password })
      .pipe(
        tap(response => {
          // store JWTs
          console.log(response);
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          this._loggedIn.next(true);
        }),
        catchError(this.loginHandler)
      ).toPromise();
  }

  // Log user out, clear stored tokens
  signOut(): Promise<any> {
    return this.http.post<any>(AUTH_URL + '/logout', { "refresh_token": localStorage.getItem('refreshToken') })
      .pipe(
        tap(() => this.clearUser())
      ).toPromise();
  }

  clearUser() {
    localStorage.clear();
    this._loggedIn.next(false);
  }

  // TODO: IMPLEMENT LOCAL
  delete(): Promise<any> {
    return this.datasetService.deleteUser()
      .pipe(
        take(1),
        tap(() => this.clearUser())
      ).toPromise();
  }

  init() { }

  private getAuth(): boolean {
    return localStorage.getItem('refreshToken') != null && 
          !this.jwt.isTokenExpired(localStorage.getItem('refreshToken'));
  }

  // User is logged in
  isAuthenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(this.getAuth()) resolve();
      else reject();
    });
  }

  // Get access token, automatically refresh if necessary
  getToken(): Observable<string> {
    console.log("get token")
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');
    console.log(refreshToken)
    console.log(accessToken)
    if (!this.jwt.isTokenExpired(accessToken)) {
      return new BehaviorSubject(accessToken);
    } else if (!this.jwt.isTokenExpired(refreshToken)) {
      console.log('refreshing access token');
      const opts = {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + refreshToken
        })
      };
      return this.http.post<any>(AUTH_URL + "/refresh", {}, opts).pipe(
        map(response => {
          localStorage.setItem('accessToken', response.accessToken);
          console.log('authentication refresh successful');
          return response.accessToken;
        })
      );
    } else {
      return throwError('refresh token is expired');
    }
  }

  sendAgain(email) {
    return this.http.post<any>(AUTH_URL + '/signup', { "mail": email }).pipe(
      map(response => response.message),
      catchError(this.errorHandler)
    ).toPromise();
  }
}