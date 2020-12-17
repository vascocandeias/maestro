import { Injectable } from '@angular/core';
import Auth from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { Subject, Observable, BehaviorSubject, from } from 'rxjs';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { DatasetService } from '../services/dataset.service';
import { map } from 'rxjs/operators';

export interface NewUser {
  email: string,
  password: string,
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private _authState: Subject<CognitoUser|any> = new Subject<CognitoUser|any>();
  authState: Observable<CognitoUser|any> = this._authState.asObservable();
  private _loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this._loggedIn.asObservable();
  }

  public static SIGN_IN = 'signIn';
  public static SIGN_OUT = 'signOut'; 

  constructor(
    private datasetService: DatasetService
  ) { 
    Hub.listen('auth',(data) => {
      const { channel, payload } = data;
      if (channel === 'auth') {
        this._authState.next(payload.event);
      }
    });
  }
  
  signUp(user: NewUser): Promise<CognitoUser|any> {
    return Auth.signUp({
      "username": user.email,
      "password": user.password,
      "attributes": {
        "email": user.email,
      }
    });
  }

  confirm(email, code): Promise<any> {
    return Auth.confirmSignUp(email, code);
  }

  signIn(username: string, password: string):Promise<CognitoUser|any> {
    return new Promise((resolve,reject) => {
      Auth.signIn(username,password)
      .then((user: CognitoUser|any) => {
        Auth.currentUserCredentials().then(any => console.log("test", any))
        this._loggedIn.next(true);
        resolve(user);
      }).catch((error: any) => reject(error));
    });
  }

  async signOut(): Promise<any> {
    await Auth.signOut();
    return this._loggedIn.next(false);
  }

  async delete(): Promise<any> {
    await this.datasetService.deleteUser()
      .toPromise();
    return await this.signOut();
  }

  getToken(): Observable<string> {
    return from(Auth.currentSession()).pipe(
      map(cognito_session => cognito_session.getIdToken().getJwtToken())
    )
  }

  isAuthenticated(): Promise<boolean> {
    return Auth.currentAuthenticatedUser();
  }

  sendAgain(email) {
    return Auth.resendSignUp(email);
  }

  init() {
    Auth.currentAuthenticatedUser()
      .then(() => this._loggedIn.next(true))
      .catch(() => this._loggedIn.next(false));
  }
}