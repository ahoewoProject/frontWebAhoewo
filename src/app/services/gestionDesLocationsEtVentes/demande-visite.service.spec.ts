import { TestBed } from '@angular/core/testing';

import { DemandeVisiteService } from './demande-visite.service';

describe('DemandeVisiteService', () => {
  let service: DemandeVisiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandeVisiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
