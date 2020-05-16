import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './components/app.component';

import { UiComponentsModule } from './ui-components/ui-components.module';

import { LoginComponent } from './components/login/login.component';
import { ScheduledPostsComponent } from './components/scheduled-posts/scheduled-posts.component';
import { ScheduledPostLineComponent } from './components/scheduled-post-line/scheduled-post-line.component';
import { AuthInterceptor } from './authInterceptor';
import { RedditLoginPageComponent } from './components/reddit-login-page/reddit-login-page.component';
import { TwitterLoginPageComponent } from './components/twitter-login-page/twitter-login-page.component';
import { IndexPageComponent } from './components/index-page/index-page.component';

const appRoutes: Routes = [
  { path: 'twitter_login', component: TwitterLoginPageComponent,
    pathMatch: 'full'
  },
  { path: 'reddit_login', component: RedditLoginPageComponent,
    pathMatch: 'full'
  },
  { path: '**', component: IndexPageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ScheduledPostsComponent,
    ScheduledPostLineComponent,
    RedditLoginPageComponent,
    TwitterLoginPageComponent,
    IndexPageComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['https://twiddit.tk/api', 'http://localhost/api'],
        sendAccessToken: true
      }
    }),
    HttpClientModule,
    BrowserAnimationsModule,
    UiComponentsModule,
    FormsModule
  ],
  providers: [
    { provide: OAuthStorage, useValue: localStorage },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
