import { TestBed } from '@angular/core/testing';

import { SuiviEntretienService } from './suivi-entretien.service';

describe('SuiviEntretienService', () => {
  let service: SuiviEntretienService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuiviEntretienService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
