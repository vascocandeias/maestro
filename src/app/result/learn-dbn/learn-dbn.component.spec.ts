import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnDBNComponent } from './learn-dbn.component';

describe('LearnDBNComponent', () => {
  let component: LearnDBNComponent;
  let fixture: ComponentFixture<LearnDBNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnDBNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnDBNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
