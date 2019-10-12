import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './components/app.component';

import { UiComponentsModule } from './ui-components/ui-components.module';

import { LoginComponent } from './components/login/login.component';
import { ScheduledPostsComponent } from './components/scheduled-posts/scheduled-posts.component';
import { ScheduledPostLineComponent } from './components/scheduled-post-line/scheduled-post-line.component';
import { AuthInterceptor } from './authInterceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ScheduledPostsComponent,
    ScheduledPostLineComponent,
  ],
  imports: [
    BrowserModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['https://twiddit.tk/api'],
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
