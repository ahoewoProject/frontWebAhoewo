import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDesLocationsEtVentesComponent } from './gestion-des-locations-et-ventes.component';

describe('GestionDesLocationsEtVentesComponent', () => {
  let component: GestionDesLocationsEtVentesComponent;
  let fixture: ComponentFixture<GestionDesLocationsEtVentesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionDesLocationsEtVentesComponent]
    });
    fixture = TestBed.createComponent(GestionDesLocationsEtVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
