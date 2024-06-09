import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBienImmobilierComponent } from './add-bien-immobilier.component';

describe('AddBienImmobilierComponent', () => {
  let component: AddBienImmobilierComponent;
  let fixture: ComponentFixture<AddBienImmobilierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBienImmobilierComponent]
    });
    fixture = TestBed.createComponent(AddBienImmobilierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
