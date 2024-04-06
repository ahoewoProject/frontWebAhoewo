import { TestBed } from '@angular/core/testing';

import { ContratVenteService } from './contrat-vente.service';

describe('ContratVenteService', () => {
  let service: ContratVenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContratVenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
