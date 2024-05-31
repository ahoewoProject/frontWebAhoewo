import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDesBiensImmobiliersComponent } from './gestion-des-biens-immobiliers.component';

describe('GestionDesBiensImmobiliersComponent', () => {
  let component: GestionDesBiensImmobiliersComponent;
  let fixture: ComponentFixture<GestionDesBiensImmobiliersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionDesBiensImmobiliersComponent]
    });
    fixture = TestBed.createComponent(GestionDesBiensImmobiliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
