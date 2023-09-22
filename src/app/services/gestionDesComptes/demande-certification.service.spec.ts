import { TestBed } from '@angular/core/testing';

import { DemandeCertificationService } from './demande-certification.service';

describe('DemandeCertificationService', () => {
  let service: DemandeCertificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandeCertificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
