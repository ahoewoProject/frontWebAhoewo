import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotairesComponent } from './notaires.component';

describe('NotairesComponent', () => {
  let component: NotairesComponent;
  let fixture: ComponentFixture<NotairesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotairesComponent]
    });
    fixture = TestBed.createComponent(NotairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
