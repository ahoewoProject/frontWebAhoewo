import { TestBed } from '@angular/core/testing';

import { ServicesAgenceImmobiliereService } from './services-agence-immobiliere.service';

describe('ServicesAgenceImmobiliereService', () => {
  let service: ServicesAgenceImmobiliereService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesAgenceImmobiliereService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
