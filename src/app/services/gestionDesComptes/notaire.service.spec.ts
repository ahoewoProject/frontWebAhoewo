import { TestBed } from '@angular/core/testing';

import { NotaireService } from './notaire.service';

describe('NotaireService', () => {
  let service: NotaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
