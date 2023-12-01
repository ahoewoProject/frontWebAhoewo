import { TestBed } from '@angular/core/testing';

import { DivertissementService } from './divertissement.service';

describe('DivertissementService', () => {
  let service: DivertissementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DivertissementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
