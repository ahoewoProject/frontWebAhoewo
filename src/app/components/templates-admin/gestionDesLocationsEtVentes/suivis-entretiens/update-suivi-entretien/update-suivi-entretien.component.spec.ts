import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSuiviEntretienComponent } from './update-suivi-entretien.component';

describe('UpdateSuiviEntretienComponent', () => {
  let component: UpdateSuiviEntretienComponent;
  let fixture: ComponentFixture<UpdateSuiviEntretienComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSuiviEntretienComponent]
    });
    fixture = TestBed.createComponent(UpdateSuiviEntretienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
