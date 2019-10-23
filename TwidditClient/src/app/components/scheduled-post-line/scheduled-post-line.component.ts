import { Component, OnInit, Input, Output } from '@angular/core';
import { SchedulingService } from 'src/app/services/scheduling.service';
import * as moment from 'moment';

@Component({
  selector: 'app-scheduled-post-line',
  templateUrl: './scheduled-post-line.component.html',
  styleUrls: ['./scheduled-post-line.component.css']
})
export class ScheduledPostLineComponent implements OnInit {

  @Input() post: ScheduledPost;

  postDate: { day: number, month: number, year: number };
  postTime: { hour: number, minute: number };

  public displayEditDialog: boolean;

  constructor(public schedulingService: SchedulingService) {
  }

  ngOnInit() {
  }

  delete(post: ScheduledPost) {
    this.schedulingService.deletePost(post.id);
  }

  open() {
    const postDateTime = moment.utc(this.post.postDateTime).local();
    this.postDate = { day: postDateTime.date(), month: postDateTime.month() + 1, year: postDateTime.year() };
    this.postTime = { hour: postDateTime.hour(), minute: postDateTime.minute() };
    this.displayEditDialog = true;
  }

  async onSavePost(): Promise<void> {
    const postDateTime = moment({
      ...this.postTime,
      date: this.postDate.day,
      month: this.postDate.month - 1
    }).utc();
    this.post.postDateTime = postDateTime.toISOString();
    await this.schedulingService.updatePost(this.post);
    this.displayEditDialog = false;
  }
}
