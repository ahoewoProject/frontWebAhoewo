import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuResponsableComponent } from './menu-responsable.component';

describe('MenuResponsableComponent', () => {
  let component: MenuResponsableComponent;
  let fixture: ComponentFixture<MenuResponsableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuResponsableComponent]
    });
    fixture = TestBed.createComponent(MenuResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
