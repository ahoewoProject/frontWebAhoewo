import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposerContratVenteComponent } from './proposer-contrat-vente.component';

describe('ProposerContratVenteComponent', () => {
  let component: ProposerContratVenteComponent;
  let fixture: ComponentFixture<ProposerContratVenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProposerContratVenteComponent]
    });
    fixture = TestBed.createComponent(ProposerContratVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
