import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencesImmobilieresComponent } from './agences-immobilieres.component';

describe('AgencesImmobilieresComponent', () => {
  let component: AgencesImmobilieresComponent;
  let fixture: ComponentFixture<AgencesImmobilieresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgencesImmobilieresComponent]
    });
    fixture = TestBed.createComponent(AgencesImmobilieresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
