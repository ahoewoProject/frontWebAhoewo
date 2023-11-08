import { TestBed } from '@angular/core/testing';

import { DelegationGestionService } from './delegation-gestion.service';

describe('DelegationGestionService', () => {
  let service: DelegationGestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DelegationGestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
