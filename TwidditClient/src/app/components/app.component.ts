import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';
import { authConfig } from '../../auth.config';
import { Component } from '@angular/core';
import { filter } from 'rxjs/operators';
import { SchedulingService } from '../services/scheduling.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Twiddit';

  constructor() {

  }
}
