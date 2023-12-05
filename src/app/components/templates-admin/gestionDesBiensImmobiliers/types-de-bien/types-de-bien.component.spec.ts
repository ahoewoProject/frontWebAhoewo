import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesDeBienComponent } from './types-de-bien.component';

describe('TypesDeBienComponent', () => {
  let component: TypesDeBienComponent;
  let fixture: ComponentFixture<TypesDeBienComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypesDeBienComponent]
    });
    fixture = TestBed.createComponent(TypesDeBienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
