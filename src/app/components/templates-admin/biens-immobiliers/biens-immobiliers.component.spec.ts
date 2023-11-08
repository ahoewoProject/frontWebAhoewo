import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiensImmobiliersComponent } from './biens-immobiliers.component';

describe('BiensImmobiliersComponent', () => {
  let component: BiensImmobiliersComponent;
  let fixture: ComponentFixture<BiensImmobiliersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BiensImmobiliersComponent]
    });
    fixture = TestBed.createComponent(BiensImmobiliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
