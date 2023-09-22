import { TestBed } from '@angular/core/testing';

import { DemarcheurService } from './demarcheur.service';

describe('DemarcheurService', () => {
  let service: DemarcheurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemarcheurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
