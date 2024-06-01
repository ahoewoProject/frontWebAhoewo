import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDemarcheurComponent } from './menu-demarcheur.component';

describe('MenuDemarcheurComponent', () => {
  let component: MenuDemarcheurComponent;
  let fixture: ComponentFixture<MenuDemarcheurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuDemarcheurComponent]
    });
    fixture = TestBed.createComponent(MenuDemarcheurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
