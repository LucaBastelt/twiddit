import { Component, OnInit } from '@angular/core';
import { SchedulingService } from 'src/app/services/scheduling.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-scheduled-posts',
  templateUrl: './scheduled-posts.component.html',
  styleUrls: ['./scheduled-posts.component.css']
})
export class ScheduledPostsComponent implements OnInit {
  scheduledPosts$: Observable<ScheduledPost[]>;

  newPost: ScheduledPost;

  newPostDate: { day: number, month: number, year: number };
  newPostTime: { hour: number, minute: number };

  public displayCreateDialog: boolean;

  constructor(public schedulingService: SchedulingService) {
  }

  ngOnInit() {
    this.scheduledPosts$ = this.schedulingService.getPosts();
    this.resetNewPost();
    this.schedulingService.reloadPosts();
  }

  resetNewPost() {
    this.newPost = {
      twitter: { text: '' },
      reddit: {
        title: '', subreddit: '',
        nsfw: false
      },
      imageUrl: '',
      postDateTime: moment().toString()
    } as ScheduledPost;
  }

  reloadPosts() {
    this.schedulingService.reloadPosts();
  }

  openAddDialog() {
    const postDateTime = moment().local();
    this.newPostDate = { day: postDateTime.date(), month: postDateTime.month() + 1, year: postDateTime.year() };
    this.newPostTime = { hour: postDateTime.hour(), minute: postDateTime.minute() };
    this.displayCreateDialog = true;
  }

  async onAddPost(): Promise<void> {
    const postDateTime = moment({
      ...this.newPostTime,
      day: this.newPostDate.day,
      month: this.newPostDate.month - 1
    }).utc();
    this.newPost.postDateTime = postDateTime.toISOString();
    await this.schedulingService.addPost(this.newPost);
    this.displayCreateDialog = false;
    this.resetNewPost();
  }
}
