import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBienAssocieComponent } from './update-bien-associe.component';

describe('UpdateBienAssocieComponent', () => {
  let component: UpdateBienAssocieComponent;
  let fixture: ComponentFixture<UpdateBienAssocieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateBienAssocieComponent]
    });
    fixture = TestBed.createComponent(UpdateBienAssocieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
