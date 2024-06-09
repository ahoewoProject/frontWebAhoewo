import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateServiceAgenceComponent } from './update-service-agence.component';

describe('UpdateServiceAgenceComponent', () => {
  let component: UpdateServiceAgenceComponent;
  let fixture: ComponentFixture<UpdateServiceAgenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateServiceAgenceComponent]
    });
    fixture = TestBed.createComponent(UpdateServiceAgenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
