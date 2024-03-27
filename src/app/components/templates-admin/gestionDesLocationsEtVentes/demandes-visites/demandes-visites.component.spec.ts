import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesVisitesComponent } from './demandes-visites.component';

describe('DemandesVisitesComponent', () => {
  let component: DemandesVisitesComponent;
  let fixture: ComponentFixture<DemandesVisitesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandesVisitesComponent]
    });
    fixture = TestBed.createComponent(DemandesVisitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
