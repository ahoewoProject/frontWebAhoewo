import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDelegationGestionComponent } from './detail-delegation-gestion.component';

describe('DetailDelegationGestionComponent', () => {
  let component: DetailDelegationGestionComponent;
  let fixture: ComponentFixture<DetailDelegationGestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailDelegationGestionComponent]
    });
    fixture = TestBed.createComponent(DetailDelegationGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
