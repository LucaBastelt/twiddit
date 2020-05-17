import { Component, OnInit } from '@angular/core';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { authConfig } from 'src/auth.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  ngOnInit() {
  }

  constructor(public oauthService: OAuthService, public router: Router) {
    this.configure();

    this.oauthService.events
      .pipe(filter(e => e.type === 'token_received'))
      .subscribe(_ => {
        this.oauthService.loadUserProfile();
      });
  }

  private configure() {
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.events.subscribe(e => {
      // tslint:disable-next-line:no-console
      console.debug('oauth/oidc event', e);
    });
  }

  public login() {
      this.oauthService.initLoginFlow();
  }

  public logoff() {
      this.oauthService.logOut();
  }

  public get name() {
      const claims = this.oauthService.getIdentityClaims() as Identity;
      if (!claims) {
        return null;
      }
      return claims.name;
  }
}
