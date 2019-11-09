import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterLoginPageComponent } from './twitter-login-page.component';

describe('TwitterLoginPageComponent', () => {
  let component: TwitterLoginPageComponent;
  let fixture: ComponentFixture<TwitterLoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwitterLoginPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
