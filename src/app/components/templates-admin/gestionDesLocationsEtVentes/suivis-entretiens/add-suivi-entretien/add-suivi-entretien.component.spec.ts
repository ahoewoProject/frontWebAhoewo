import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSuiviEntretienComponent } from './add-suivi-entretien.component';

describe('AddSuiviEntretienComponent', () => {
  let component: AddSuiviEntretienComponent;
  let fixture: ComponentFixture<AddSuiviEntretienComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSuiviEntretienComponent]
    });
    fixture = TestBed.createComponent(AddSuiviEntretienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
