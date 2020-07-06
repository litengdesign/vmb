import { TestBed } from '@angular/core/testing';

import { ComomService } from './servers.service';

describe('ComomService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComomService = TestBed.get(ComomService);
    expect(service).toBeTruthy();
  });
});
