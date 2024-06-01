import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiensAssociesComponent } from './biens-associes.component';

describe('BiensAssociesComponent', () => {
  let component: BiensAssociesComponent;
  let fixture: ComponentFixture<BiensAssociesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BiensAssociesComponent]
    });
    fixture = TestBed.createComponent(BiensAssociesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
