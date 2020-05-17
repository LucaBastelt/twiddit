
import { Component, OnInit } from '@angular/core';
import { filter, switchMap } from 'rxjs/operators';
import { OauthRegistryService } from 'src/app/services/oauth-registry.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-reddit-login-page',
  templateUrl: './reddit-login-page.component.html',
  styleUrls: ['./reddit-login-page.component.css']
})
export class RedditLoginPageComponent implements OnInit {
  redditToken$: Observable<string>;
  identity$: Observable<any>;

  constructor(public auth: OauthRegistryService, private httpClient: HttpClient) {
    this.redditToken$ = auth.getRedditOauthToken();
    this.identity$ = this.redditToken$.pipe(
      switchMap(token => {
        return this.httpClient.get('https://oauth.reddit.com/api/v1/me',
        { headers: new HttpHeaders().set('Authorization', 'bearer ' + token) });
      }),
    );
  }

  ngOnInit() {
  }

  login() {
    this.auth.doRedditLogin();
  }

  getIdentity(token: string) {
  }

  async logout() {
    await this.auth.doRedditLogout();
    this.redditToken$ = this.auth.getRedditOauthToken();
  }
}
