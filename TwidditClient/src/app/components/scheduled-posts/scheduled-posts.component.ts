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

  constructor(public schedulingService: SchedulingService) {
    this.scheduledPosts$ = schedulingService.scheduledPosts$;
  }

  ngOnInit() {}
}
