import { TestBed } from '@angular/core/testing';

import { TypeDeBienService } from './type-de-bien.service';

describe('TypeDeBienService', () => {
  let service: TypeDeBienService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeDeBienService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
