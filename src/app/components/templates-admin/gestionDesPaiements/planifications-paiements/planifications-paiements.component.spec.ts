import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificationsPaiementsComponent } from './planifications-paiements.component';

describe('PlanificationsPaiementsComponent', () => {
  let component: PlanificationsPaiementsComponent;
  let fixture: ComponentFixture<PlanificationsPaiementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanificationsPaiementsComponent]
    });
    fixture = TestBed.createComponent(PlanificationsPaiementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
