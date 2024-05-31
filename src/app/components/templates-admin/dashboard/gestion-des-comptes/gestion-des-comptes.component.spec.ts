import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDesComptesComponent } from './gestion-des-comptes.component';

describe('GestionDesComptesComponent', () => {
  let component: GestionDesComptesComponent;
  let fixture: ComponentFixture<GestionDesComptesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionDesComptesComponent]
    });
    fixture = TestBed.createComponent(GestionDesComptesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
