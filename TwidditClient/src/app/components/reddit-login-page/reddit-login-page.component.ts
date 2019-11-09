
import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { OauthRegistryService } from 'src/app/services/oauth-registry.service';

@Component({
  selector: 'app-reddit-login-page',
  templateUrl: './reddit-login-page.component.html',
  styleUrls: ['./reddit-login-page.component.css']
})
export class RedditLoginPageComponent implements OnInit {

  ngOnInit() {
  }

  constructor(public auth: OauthRegistryService) {
  }

}
