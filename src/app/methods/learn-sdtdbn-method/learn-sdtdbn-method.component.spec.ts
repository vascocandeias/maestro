import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnSdtdbnMethodComponent } from './learn-sdtdbn-method.component';

describe('LearnSdtdbnMethodComponent', () => {
  let component: LearnSdtdbnMethodComponent;
  let fixture: ComponentFixture<LearnSdtdbnMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnSdtdbnMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnSdtdbnMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
