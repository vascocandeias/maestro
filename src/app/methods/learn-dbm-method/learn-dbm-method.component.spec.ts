import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnDbmMethodComponent } from './learn-dbm-method.component';

describe('LearnDbmMethodComponent', () => {
  let component: LearnDbmMethodComponent;
  let fixture: ComponentFixture<LearnDbmMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnDbmMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnDbmMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
