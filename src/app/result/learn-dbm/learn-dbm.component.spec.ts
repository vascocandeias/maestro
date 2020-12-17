import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnDbmComponent } from './learn-dbm.component';

describe('LearnDbmComponent', () => {
  let component: LearnDbmComponent;
  let fixture: ComponentFixture<LearnDbmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnDbmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnDbmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
