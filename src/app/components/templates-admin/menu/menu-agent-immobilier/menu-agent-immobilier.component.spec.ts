import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAgentImmobilierComponent } from './menu-agent-immobilier.component';

describe('MenuAgentImmobilierComponent', () => {
  let component: MenuAgentImmobilierComponent;
  let fixture: ComponentFixture<MenuAgentImmobilierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuAgentImmobilierComponent]
    });
    fixture = TestBed.createComponent(MenuAgentImmobilierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
