import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchedulingService {
  apiPath = environment.apiUrl + '/scheduled-posts';

  scheduledPosts$: Observable<ScheduledPost[]>;

  dummyData = [
    {
      reddittitle: 'posty mcpostboi',
      subreddit: '/r/stuff',
      nsfw: 'false',
      twittertext: 'Posti to twitter boi',
      imageurl: 'http://imgur.com/sdgf',
      postdatetime: '2019-10-10T09:30'
    },
    {
      reddittitle: 'posty mcpostboi 2',
      subreddit: '/r/stuff',
      twittertext: '',
      nsfw: 'false',
      imageurl: 'http://imgur.com/2345',
      postdatetime: '2019-10-11T19:30'
    },
    {
      reddittitle: '',
      subreddit: '',
      nsfw: 'false',
      twittertext: 'posty mcpostboi 3',
      imageurl: 'http://imgur.com/sda4bv345qgf',
      postdatetime: '2019-10-11T01:30'
    }
  ];

  constructor(private httpClient: HttpClient) {
    this.scheduledPosts$ = this.httpClient.get<any[]>(this.apiPath, !environment.production ? {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: environment.dummyJwt
      })
    } : {}).pipe();
  }

  deletePost(post: ScheduledPost) {
    throw new Error('Method not implemented.');
  }

  formatDateHeader(dateTime: string): string {
    return moment(dateTime).format('M.D.YY HH:mm');
  }
}

