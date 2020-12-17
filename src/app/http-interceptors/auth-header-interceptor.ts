import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor
{
    constructor(
        private auth: AuthService,
        private router: Router)
    { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        if (!/.*\/auth\/.*/.test(request.url)) {
            return this.auth.getToken().pipe(
                switchMap((accessToken: string) => {
                    const reqAuth: HttpRequest<any> = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    return next.handle(reqAuth);
                })
            );
        } else {
            return next.handle(request);
        }
    }
}