import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeteorMethodComponent } from './meteor-method.component';

describe('MeteorMethodComponent', () => {
  let component: MeteorMethodComponent;
  let fixture: ComponentFixture<MeteorMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeteorMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeteorMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
