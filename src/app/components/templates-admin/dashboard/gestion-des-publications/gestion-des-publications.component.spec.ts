import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDesPublicationsComponent } from './gestion-des-publications.component';

describe('GestionDesPublicationsComponent', () => {
  let component: GestionDesPublicationsComponent;
  let fixture: ComponentFixture<GestionDesPublicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionDesPublicationsComponent]
    });
    fixture = TestBed.createComponent(GestionDesPublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
