import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceAgenceComponent } from './add-service-agence.component';

describe('AddServiceAgenceComponent', () => {
  let component: AddServiceAgenceComponent;
  let fixture: ComponentFixture<AddServiceAgenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddServiceAgenceComponent]
    });
    fixture = TestBed.createComponent(AddServiceAgenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
