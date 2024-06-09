import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAgenceImmobiliereComponent } from './add-agence-immobiliere.component';

describe('AddAgenceImmobiliereComponent', () => {
  let component: AddAgenceImmobiliereComponent;
  let fixture: ComponentFixture<AddAgenceImmobiliereComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddAgenceImmobiliereComponent]
    });
    fixture = TestBed.createComponent(AddAgenceImmobiliereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
