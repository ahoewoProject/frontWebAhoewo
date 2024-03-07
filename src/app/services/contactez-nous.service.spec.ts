import { TestBed } from '@angular/core/testing';

import { ContactezNousService } from './contactez-nous.service';

describe('ContactezNousService', () => {
  let service: ContactezNousService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactezNousService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
