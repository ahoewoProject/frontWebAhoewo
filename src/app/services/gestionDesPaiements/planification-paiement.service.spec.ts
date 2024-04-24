import { TestBed } from '@angular/core/testing';

import { PlanificationPaiementService } from './planification-paiement.service';

describe('PlanificationPaiementService', () => {
  let service: PlanificationPaiementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanificationPaiementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
