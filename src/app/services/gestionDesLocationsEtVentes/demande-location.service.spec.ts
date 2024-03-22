import { TestBed } from '@angular/core/testing';

import { DemandeLocationService } from './demande-location.service';

describe('DemandeLocationService', () => {
  let service: DemandeLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandeLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
