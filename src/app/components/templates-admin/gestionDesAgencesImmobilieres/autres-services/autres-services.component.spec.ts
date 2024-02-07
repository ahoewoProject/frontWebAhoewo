import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutresServicesComponent } from './autres-services.component';

describe('AutresServicesComponent', () => {
  let component: AutresServicesComponent;
  let fixture: ComponentFixture<AutresServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutresServicesComponent]
    });
    fixture = TestBed.createComponent(AutresServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
