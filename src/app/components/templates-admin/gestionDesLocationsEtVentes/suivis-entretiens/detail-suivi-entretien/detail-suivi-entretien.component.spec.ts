import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSuiviEntretienComponent } from './detail-suivi-entretien.component';

describe('DetailSuiviEntretienComponent', () => {
  let component: DetailSuiviEntretienComponent;
  let fixture: ComponentFixture<DetailSuiviEntretienComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailSuiviEntretienComponent]
    });
    fixture = TestBed.createComponent(DetailSuiviEntretienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
