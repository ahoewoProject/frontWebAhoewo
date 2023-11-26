import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VillesComponent } from './villes.component';

describe('VillesComponent', () => {
  let component: VillesComponent;
  let fixture: ComponentFixture<VillesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VillesComponent]
    });
    fixture = TestBed.createComponent(VillesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
