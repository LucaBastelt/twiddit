import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  ngOnInit() {
  }

  constructor(public oauthService: OAuthService) {
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
