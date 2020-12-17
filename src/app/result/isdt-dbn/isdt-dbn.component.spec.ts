import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsdtDBNComponent } from './isdt-dbn.component';

describe('IsdtDBNComponent', () => {
  let component: IsdtDBNComponent;
  let fixture: ComponentFixture<IsdtDBNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsdtDBNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsdtDBNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
