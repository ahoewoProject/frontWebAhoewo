import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuivisEntretiensComponent } from './suivis-entretiens.component';

describe('SuivisEntretiensComponent', () => {
  let component: SuivisEntretiensComponent;
  let fixture: ComponentFixture<SuivisEntretiensComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuivisEntretiensComponent]
    });
    fixture = TestBed.createComponent(SuivisEntretiensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
