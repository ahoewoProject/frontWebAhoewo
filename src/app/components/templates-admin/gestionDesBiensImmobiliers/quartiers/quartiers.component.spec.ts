import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuartiersComponent } from './quartiers.component';

describe('QuartiersComponent', () => {
  let component: QuartiersComponent;
  let fixture: ComponentFixture<QuartiersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuartiersComponent]
    });
    fixture = TestBed.createComponent(QuartiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
