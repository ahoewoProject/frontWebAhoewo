import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentImmobilierAddComponent } from './agent-immobilier-add.component';

describe('AgentImmobilierAddComponent', () => {
  let component: AgentImmobilierAddComponent;
  let fixture: ComponentFixture<AgentImmobilierAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentImmobilierAddComponent]
    });
    fixture = TestBed.createComponent(AgentImmobilierAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
