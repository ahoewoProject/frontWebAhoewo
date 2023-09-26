import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesCertificationsComponent } from './demandes-certifications.component';

describe('DemandesCertificationsComponent', () => {
  let component: DemandesCertificationsComponent;
  let fixture: ComponentFixture<DemandesCertificationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandesCertificationsComponent]
    });
    fixture = TestBed.createComponent(DemandesCertificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
