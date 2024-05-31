import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDesPaiementsComponent } from './gestion-des-paiements.component';

describe('GestionDesPaiementsComponent', () => {
  let component: GestionDesPaiementsComponent;
  let fixture: ComponentFixture<GestionDesPaiementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionDesPaiementsComponent]
    });
    fixture = TestBed.createComponent(GestionDesPaiementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
