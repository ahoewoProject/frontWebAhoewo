import { TestBed } from '@angular/core/testing';

import { AffectationAgentAgenceService } from './affectation-agent-agence.service';

describe('AffectationAgentAgenceService', () => {
  let service: AffectationAgentAgenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffectationAgentAgenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
