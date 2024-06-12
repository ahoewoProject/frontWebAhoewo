import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPlanificationPaiementComponent } from './detail-planification-paiement.component';

describe('DetailPlanificationPaiementComponent', () => {
  let component: DetailPlanificationPaiementComponent;
  let fixture: ComponentFixture<DetailPlanificationPaiementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailPlanificationPaiementComponent]
    });
    fixture = TestBed.createComponent(DetailPlanificationPaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
