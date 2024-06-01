import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuClientComponent } from './menu-client.component';

describe('MenuClientComponent', () => {
  let component: MenuClientComponent;
  let fixture: ComponentFixture<MenuClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuClientComponent]
    });
    fixture = TestBed.createComponent(MenuClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
