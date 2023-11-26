import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesAgenceImmobiliereComponent } from './services-agence-immobiliere.component';

describe('ServicesAgenceImmobiliereComponent', () => {
  let component: ServicesAgenceImmobiliereComponent;
  let fixture: ComponentFixture<ServicesAgenceImmobiliereComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServicesAgenceImmobiliereComponent]
    });
    fixture = TestBed.createComponent(ServicesAgenceImmobiliereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
