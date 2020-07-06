import { TestBed } from '@angular/core/testing';

import { LoadmoreService } from './loadmore.service';

describe('LoadmoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadmoreService = TestBed.get(LoadmoreService);
    expect(service).toBeTruthy();
  });
});
