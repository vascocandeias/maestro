import { Component, ViewChildren, QueryList } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {

  @ViewChildren('drawer') drawer: QueryList<MatSidenav>;
  menuItems = ['upload', 'datasets', 'results', 'networks', 'others'];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isLoggedIn$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoggedIn$ = this.auth.isLoggedIn;
  }

  logout() {
    this.auth.signOut()
      .then(() => this.router.navigate(['/']));
  }

  delete() {
    this.auth.delete()
      .then(() => this.router.navigate(['/']));
  }

  atRoot(): boolean {
    return window.location.pathname == "/" || window.location.pathname == "/maestro/";
  }
}
