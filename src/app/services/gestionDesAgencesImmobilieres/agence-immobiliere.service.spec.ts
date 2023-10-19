import { TestBed } from '@angular/core/testing';

import { AgenceImmobiliereService } from './agence-immobiliere.service';

describe('AgenceImmobiliereService', () => {
  let service: AgenceImmobiliereService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgenceImmobiliereService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
