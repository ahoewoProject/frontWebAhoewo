import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsableAgenceAddComponent } from './responsable-agence-add.component';

describe('ResponsableAgenceAddComponent', () => {
  let component: ResponsableAgenceAddComponent;
  let fixture: ComponentFixture<ResponsableAgenceAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResponsableAgenceAddComponent]
    });
    fixture = TestBed.createComponent(ResponsableAgenceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
