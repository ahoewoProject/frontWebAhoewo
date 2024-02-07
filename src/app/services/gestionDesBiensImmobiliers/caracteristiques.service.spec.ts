import { TestBed } from '@angular/core/testing';

import { CaracteristiquesService } from './caracteristiques.service';

describe('CaracteristiquesService', () => {
  let service: CaracteristiquesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaracteristiquesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
