import { TestBed } from '@angular/core/testing';

import { ComptePaiementService } from './compte-paiement.service';

describe('ComptePaiementService', () => {
  let service: ComptePaiementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComptePaiementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
