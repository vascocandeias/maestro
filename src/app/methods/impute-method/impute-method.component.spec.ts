import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImputeMethodComponent } from './impute-method.component';

describe('ImputeMethodComponent', () => {
  let component: ImputeMethodComponent;
  let fixture: ComponentFixture<ImputeMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImputeMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImputeMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
