import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuNotaireComponent } from './menu-notaire.component';

describe('MenuNotaireComponent', () => {
  let component: MenuNotaireComponent;
  let fixture: ComponentFixture<MenuNotaireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuNotaireComponent]
    });
    fixture = TestBed.createComponent(MenuNotaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
