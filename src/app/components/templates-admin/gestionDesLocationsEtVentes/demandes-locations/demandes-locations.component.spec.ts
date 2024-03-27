import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesLocationsComponent } from './demandes-locations.component';

describe('DemandesLocationsComponent', () => {
  let component: DemandesLocationsComponent;
  let fixture: ComponentFixture<DemandesLocationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandesLocationsComponent]
    });
    fixture = TestBed.createComponent(DemandesLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
