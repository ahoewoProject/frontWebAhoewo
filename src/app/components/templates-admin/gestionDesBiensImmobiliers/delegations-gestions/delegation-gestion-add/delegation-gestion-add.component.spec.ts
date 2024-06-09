import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegationGestionAddComponent } from './delegation-gestion-add.component';

describe('DelegationGestionAddComponent', () => {
  let component: DelegationGestionAddComponent;
  let fixture: ComponentFixture<DelegationGestionAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DelegationGestionAddComponent]
    });
    fixture = TestBed.createComponent(DelegationGestionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
