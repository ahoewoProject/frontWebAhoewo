import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBienImmobilierComponent } from './update-bien-immobilier.component';

describe('UpdateBienImmobilierComponent', () => {
  let component: UpdateBienImmobilierComponent;
  let fixture: ComponentFixture<UpdateBienImmobilierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateBienImmobilierComponent]
    });
    fixture = TestBed.createComponent(UpdateBienImmobilierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
