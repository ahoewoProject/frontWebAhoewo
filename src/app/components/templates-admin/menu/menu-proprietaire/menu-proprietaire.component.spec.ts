import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuProprietaireComponent } from './menu-proprietaire.component';

describe('MenuProprietaireComponent', () => {
  let component: MenuProprietaireComponent;
  let fixture: ComponentFixture<MenuProprietaireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuProprietaireComponent]
    });
    fixture = TestBed.createComponent(MenuProprietaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
