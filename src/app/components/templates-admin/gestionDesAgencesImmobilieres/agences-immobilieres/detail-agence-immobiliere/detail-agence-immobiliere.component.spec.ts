import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAgenceImmobiliereComponent } from './detail-agence-immobiliere.component';

describe('DetailAgenceImmobiliereComponent', () => {
  let component: DetailAgenceImmobiliereComponent;
  let fixture: ComponentFixture<DetailAgenceImmobiliereComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailAgenceImmobiliereComponent]
    });
    fixture = TestBed.createComponent(DetailAgenceImmobiliereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
