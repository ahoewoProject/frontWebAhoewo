import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBienAssocieComponent } from './add-bien-associe.component';

describe('AddBienAssocieComponent', () => {
  let component: AddBienAssocieComponent;
  let fixture: ComponentFixture<AddBienAssocieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBienAssocieComponent]
    });
    fixture = TestBed.createComponent(AddBienAssocieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
