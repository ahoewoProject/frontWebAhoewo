import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDelegationGestionComponent } from './add-delegation-gestion.component';

describe('AddDelegationGestionComponent', () => {
  let component: AddDelegationGestionComponent;
  let fixture: ComponentFixture<AddDelegationGestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDelegationGestionComponent]
    });
    fixture = TestBed.createComponent(AddDelegationGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
