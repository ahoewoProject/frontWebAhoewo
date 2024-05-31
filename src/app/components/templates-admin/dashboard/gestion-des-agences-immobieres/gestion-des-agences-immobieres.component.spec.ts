import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDesAgencesImmobieresComponent } from './gestion-des-agences-immobieres.component';

describe('GestionDesAgencesImmobieresComponent', () => {
  let component: GestionDesAgencesImmobieresComponent;
  let fixture: ComponentFixture<GestionDesAgencesImmobieresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionDesAgencesImmobieresComponent]
    });
    fixture = TestBed.createComponent(GestionDesAgencesImmobieresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
