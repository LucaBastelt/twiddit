import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs/operators';
import { Moment } from 'moment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SchedulingService {
  apiPath = 'http://dad928fc.ngrok.io/api/schedule';

  scheduledPosts$: Observable<ScheduledPost[]>;

  dummyData = [
    {
      reddit: { title: 'posty mcpostboi', subreddit: '/r/stuff' },
      twitter: { text: 'Posti to twitter boi' },
      imageUrl: 'http://imgur.com/sdgf',
      postDateTime: '2019-10-10T09:30'
    } as ScheduledPost,
    {
      reddit: { title: 'posty mcpostboi 2', subreddit: '/r/stuff' },
      twitter: {text: ''},
      imageUrl: 'http://imgur.com/sdgf',
      postDateTime: '2019-10-11T19:30'
    } as ScheduledPost,
    {
      reddit: {title: '', subreddit: '', nsfw: false},
      twitter: { text: 'posty mcpostboi 3' },
      postDateTime: '2019-10-11T01:30'
    } as ScheduledPost
  ];

  constructor(private httpClient: HttpClient) {
    // this.scheduledPosts$ = this.httpClient.get<ScheduledPost[]>(this.apiPath).pipe();
    this.scheduledPosts$ = of(this.dummyData).pipe(delay(1));
  }

  deletePost(post: ScheduledPost) {
    throw new Error('Method not implemented.');
  }

  formatDateHeader(dateTime: string): string {
    return moment(dateTime).format('M.D.YY HH:mm');
  }
}
