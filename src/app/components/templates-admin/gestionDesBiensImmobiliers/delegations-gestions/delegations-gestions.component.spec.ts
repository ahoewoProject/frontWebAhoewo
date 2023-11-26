import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegationsGestionsComponent } from './delegations-gestions.component';

describe('DelegationsGestionsComponent', () => {
  let component: DelegationsGestionsComponent;
  let fixture: ComponentFixture<DelegationsGestionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DelegationsGestionsComponent]
    });
    fixture = TestBed.createComponent(DelegationsGestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
