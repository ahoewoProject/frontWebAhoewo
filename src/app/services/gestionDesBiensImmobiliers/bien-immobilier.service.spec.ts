import { TestBed } from '@angular/core/testing';

import { BienImmobilierService } from './bien-immobilier.service';

describe('BienImmobilierService', () => {
  let service: BienImmobilierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BienImmobilierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
