import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrateursComponent } from './administrateurs.component';

describe('AdministrateursComponent', () => {
  let component: AdministrateursComponent;
  let fixture: ComponentFixture<AdministrateursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdministrateursComponent]
    });
    fixture = TestBed.createComponent(AdministrateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
