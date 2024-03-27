import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesAchatsComponent } from './demandes-achats.component';

describe('DemandesAchatsComponent', () => {
  let component: DemandesAchatsComponent;
  let fixture: ComponentFixture<DemandesAchatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandesAchatsComponent]
    });
    fixture = TestBed.createComponent(DemandesAchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
