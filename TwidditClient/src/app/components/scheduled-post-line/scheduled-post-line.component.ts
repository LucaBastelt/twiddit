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

  postDate;
  postTime;

  public displayEditDialog: boolean;

  constructor(public schedulingService: SchedulingService) {}

  ngOnInit() {
  }

  delete(post: ScheduledPost) {
    this.schedulingService.deletePost(post.id);
  }

  open(post: ScheduledPost) {
    this.displayEditDialog = true;
  }

  onSavePost() {
    // TODO: Save post
  }
}
