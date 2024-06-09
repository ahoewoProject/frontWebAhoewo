import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDelegationGestionComponent } from './update-delegation-gestion.component';

describe('UpdateDelegationGestionComponent', () => {
  let component: UpdateDelegationGestionComponent;
  let fixture: ComponentFixture<UpdateDelegationGestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateDelegationGestionComponent]
    });
    fixture = TestBed.createComponent(UpdateDelegationGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
