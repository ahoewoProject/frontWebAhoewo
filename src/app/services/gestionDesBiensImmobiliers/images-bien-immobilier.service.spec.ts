import { TestBed } from '@angular/core/testing';

import { ImagesBienImmobilierService } from './images-bien-immobilier.service';

describe('ImagesBienImmobilierService', () => {
  let service: ImagesBienImmobilierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagesBienImmobilierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
