import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledPostLineComponent } from './scheduled-post-line.component';

describe('ScheduledPostLineComponent', () => {
  let component: ScheduledPostLineComponent;
  let fixture: ComponentFixture<ScheduledPostLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledPostLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledPostLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
