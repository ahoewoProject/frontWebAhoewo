import { TestBed } from '@angular/core/testing';

import { MotifRejetService } from './motif-rejet.service';

describe('MotifRejetService', () => {
  let service: MotifRejetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotifRejetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
