import { TestBed } from '@angular/core/testing';

import { FacesTRXService } from './faces-trx.service';

describe('FacesTRXService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FacesTRXService = TestBed.get(FacesTRXService);
    expect(service).toBeTruthy();
  });
});
