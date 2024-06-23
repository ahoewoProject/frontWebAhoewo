import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleguerBienComponent } from './deleguer-bien.component';

describe('DeleguerBienComponent', () => {
  let component: DeleguerBienComponent;
  let fixture: ComponentFixture<DeleguerBienComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleguerBienComponent]
    });
    fixture = TestBed.createComponent(DeleguerBienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
