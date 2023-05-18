import { TestBed } from '@angular/core/testing';

import { TransportDetailsService } from './transport-details.service';

describe('TransportDetailsService', () => {
  let service: TransportDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransportDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
