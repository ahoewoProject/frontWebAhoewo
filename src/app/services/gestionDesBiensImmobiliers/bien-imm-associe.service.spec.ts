import { TestBed } from '@angular/core/testing';

import { BienImmAssocieService } from './bien-imm-associe.service';

describe('BienImmAssocieService', () => {
  let service: BienImmAssocieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BienImmAssocieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
