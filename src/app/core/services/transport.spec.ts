import { TestBed } from '@angular/core/testing';
import { TransportService } from './transport';

describe('Transport', () => {
  let service: TransportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
