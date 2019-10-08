import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledPostsComponent } from './scheduled-posts.component';

describe('ScheduledPostsComponent', () => {
  let component: ScheduledPostsComponent;
  let fixture: ComponentFixture<ScheduledPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
