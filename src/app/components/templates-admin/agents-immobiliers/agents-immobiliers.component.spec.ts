import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsImmobiliersComponent } from './agents-immobiliers.component';

describe('AgentsImmobiliersComponent', () => {
  let component: AgentsImmobiliersComponent;
  let fixture: ComponentFixture<AgentsImmobiliersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentsImmobiliersComponent]
    });
    fixture = TestBed.createComponent(AgentsImmobiliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
