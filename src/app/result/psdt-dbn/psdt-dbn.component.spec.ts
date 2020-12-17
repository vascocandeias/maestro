import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsdtDBNComponent } from './psdt-dbn.component';

describe('PsdtDBNComponent', () => {
  let component: PsdtDBNComponent;
  let fixture: ComponentFixture<PsdtDBNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsdtDBNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsdtDBNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
