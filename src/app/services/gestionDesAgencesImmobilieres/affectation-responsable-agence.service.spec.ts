import { TestBed } from '@angular/core/testing';

import { AffectationResponsableAgenceService } from './affectation-responsable-agence.service';

describe('AffectationResponsableAgenceService', () => {
  let service: AffectationResponsableAgenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffectationResponsableAgenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
