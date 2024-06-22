import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposerContratLocationComponent } from './proposer-contrat-location.component';

describe('ProposerContratLocationComponent', () => {
  let component: ProposerContratLocationComponent;
  let fixture: ComponentFixture<ProposerContratLocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProposerContratLocationComponent]
    });
    fixture = TestBed.createComponent(ProposerContratLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
