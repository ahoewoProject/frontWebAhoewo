import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiensContratsComponent } from './biens-contrats.component';

describe('BiensContratsComponent', () => {
  let component: BiensContratsComponent;
  let fixture: ComponentFixture<BiensContratsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BiensContratsComponent]
    });
    fixture = TestBed.createComponent(BiensContratsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
