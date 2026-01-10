import { TestBed } from '@angular/core/testing';
import { TransportService } from './transport';
import { Ride } from '../models/ride.model';

describe('TransportService', () => {
  let service: TransportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a ride successfully', () => {
    const ride: Ride = {
      id: '1', employeeId: 'EMP01', vehicleType: 'Car', vehicleNo: 'KA01',
      vacantSeats: 3, time: '09:00', pickupPoint: 'A', destination: 'B'
    };
    const result = service.addRide(ride);
    expect(result.success).toBeTrue();
    expect(service.rides().length).toBe(1);
  });

  it('should preventing duplicate Employee IDs from adding rides [cite: 27]', () => {
    const ride1: Ride = { id: '1', employeeId: 'EMP01', vehicleType: 'Car', vehicleNo: 'KA01', vacantSeats: 3, time: '09:00', pickupPoint: 'A', destination: 'B' };
    service.addRide(ride1);
    
    // Try adding same employee again
    const result = service.addRide(ride1);
    expect(result.success).toBeFalse();
    expect(result.message).toContain('already posted');
  });

  it('should decrease seat count on booking [cite: 35]', () => {
    const ride: Ride = { id: '1', employeeId: 'EMP01', vehicleType: 'Car', vehicleNo: 'KA01', vacantSeats: 3, time: '09:00', pickupPoint: 'A', destination: 'B' };
    service.addRide(ride);

    service.bookRide('1', 'EMP02');
    expect(service.rides()[0].vacantSeats).toBe(2);
  });

  it('should prevent creator from booking their own ride [cite: 36]', () => {
    const ride: Ride = { id: '1', employeeId: 'EMP01', vehicleType: 'Car', vehicleNo: 'KA01', vacantSeats: 3, time: '09:00', pickupPoint: 'A', destination: 'B' };
    service.addRide(ride);

    const result = service.bookRide('1', 'EMP01'); // EMP01 is creator
    expect(result.success).toBeFalse();
  });
});