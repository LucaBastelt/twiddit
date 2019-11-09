import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedditLoginPageComponent } from './reddit-login-page.component';

describe('RedditLoginPageComponent', () => {
  let component: RedditLoginPageComponent;
  let fixture: ComponentFixture<RedditLoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedditLoginPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedditLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
