import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGerantComponent } from './menu-gerant.component';

describe('MenuGerantComponent', () => {
  let component: MenuGerantComponent;
  let fixture: ComponentFixture<MenuGerantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuGerantComponent]
    });
    fixture = TestBed.createComponent(MenuGerantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
