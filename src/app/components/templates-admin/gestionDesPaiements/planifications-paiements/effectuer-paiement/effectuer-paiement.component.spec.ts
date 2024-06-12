import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectuerPaiementComponent } from './effectuer-paiement.component';

describe('EffectuerPaiementComponent', () => {
  let component: EffectuerPaiementComponent;
  let fixture: ComponentFixture<EffectuerPaiementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EffectuerPaiementComponent]
    });
    fixture = TestBed.createComponent(EffectuerPaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
