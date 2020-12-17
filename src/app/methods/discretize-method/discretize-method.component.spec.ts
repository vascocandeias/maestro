import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscretizeMethodComponent } from './discretize-method.component';

describe('DiscretizeMethodComponent', () => {
  let component: DiscretizeMethodComponent;
  let fixture: ComponentFixture<DiscretizeMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscretizeMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscretizeMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
