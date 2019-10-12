import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SchedulingService {
  apiPath = 'https://twiddit.tk/api/scheduled-posts';

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
    this.scheduledPosts$ = this.httpClient.get<any[]>(this.apiPath)
      .pipe(map((posts) => {
        const out = [];
        for (const post of posts) {
          out.push({
            reddit: { title: post.reddittitle, subreddit: post.subreddit },
            twitter: { text: post.twittertext },
            imageUrl: post.imageurl,
            postDateTime: post.postdatetime
          } as ScheduledPost);
        }
        return out;
      }));
    /*this.scheduledPosts$ = of(this.dummyData)
      .pipe(
        delay(1),
        map((posts) => {
          const out = [];
          for (const post of posts) {
            out.push({
              reddit: { title: post.reddittitle, subreddit: post.subreddit },
              twitter: { text: post.twittertext },
              imageUrl: post.imageurl,
              postDateTime: post.postdatetime
            } as ScheduledPost);
          }
          return out;
        }));*/
  }

  deletePost(post: ScheduledPost) {
    throw new Error('Method not implemented.');
  }

  formatDateHeader(dateTime: string): string {
    return moment(dateTime).format('M.D.YY HH:mm');
  }
}

