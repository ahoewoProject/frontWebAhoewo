import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAgenceImmobiliereComponent } from './update-agence-immobiliere.component';

describe('UpdateAgenceImmobiliereComponent', () => {
  let component: UpdateAgenceImmobiliereComponent;
  let fixture: ComponentFixture<UpdateAgenceImmobiliereComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateAgenceImmobiliereComponent]
    });
    fixture = TestBed.createComponent(UpdateAgenceImmobiliereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
