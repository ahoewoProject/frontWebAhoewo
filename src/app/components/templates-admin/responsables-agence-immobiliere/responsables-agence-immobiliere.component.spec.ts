import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsablesAgenceImmobiliereComponent } from './responsables-agence-immobiliere.component';

describe('ResponsablesAgenceImmobiliereComponent', () => {
  let component: ResponsablesAgenceImmobiliereComponent;
  let fixture: ComponentFixture<ResponsablesAgenceImmobiliereComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResponsablesAgenceImmobiliereComponent]
    });
    fixture = TestBed.createComponent(ResponsablesAgenceImmobiliereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
