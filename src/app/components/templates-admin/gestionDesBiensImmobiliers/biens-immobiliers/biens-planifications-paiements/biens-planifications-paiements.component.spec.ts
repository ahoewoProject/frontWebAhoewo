import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiensPlanificationsPaiementsComponent } from './biens-planifications-paiements.component';

describe('BiensPlanificationsPaiementsComponent', () => {
  let component: BiensPlanificationsPaiementsComponent;
  let fixture: ComponentFixture<BiensPlanificationsPaiementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BiensPlanificationsPaiementsComponent]
    });
    fixture = TestBed.createComponent(BiensPlanificationsPaiementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
