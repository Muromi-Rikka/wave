import { TestBed } from '@angular/core/testing';

import { WaveService } from './wave.service';

describe('WaveService', () => {
  let service: WaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
