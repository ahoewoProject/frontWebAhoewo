import { TestBed } from '@angular/core/testing';

import { ResponsableAgenceImmobiliereService } from './responsable-agence-immobiliere.service';

describe('ResponsableAgenceImmobiliereService', () => {
  let service: ResponsableAgenceImmobiliereService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsableAgenceImmobiliereService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
