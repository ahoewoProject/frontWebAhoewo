import { TestBed } from '@angular/core/testing';

import { AgentImmobilierService } from './agent-immobilier.service';

describe('AgentImmobilierService', () => {
  let service: AgentImmobilierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentImmobilierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
