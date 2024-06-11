import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiensPaiementsComponent } from './biens-paiements.component';

describe('BiensPaiementsComponent', () => {
  let component: BiensPaiementsComponent;
  let fixture: ComponentFixture<BiensPaiementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BiensPaiementsComponent]
    });
    fixture = TestBed.createComponent(BiensPaiementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
