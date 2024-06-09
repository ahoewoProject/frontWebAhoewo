import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailServiceAgenceComponent } from './detail-service-agence.component';

describe('DetailServiceAgenceComponent', () => {
  let component: DetailServiceAgenceComponent;
  let fixture: ComponentFixture<DetailServiceAgenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailServiceAgenceComponent]
    });
    fixture = TestBed.createComponent(DetailServiceAgenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
