import { RideService } from './ride.service';
import { Ride } from '../models/ride.model';

describe('RideService', () => {
  let service: RideService;

  beforeEach(() => {
    service = new RideService();
    localStorage.clear();
  });

  it('should add a new ride', () => {
    const ride: Ride = {
      id: '1',
      employeeId: 'EMP1',
      vehicleType: 'Car',
      vehicleNo: 'KA01AB1234',
      vacantSeats: 2,
      time: '10:00',
      pickupPoint: 'Office',
      destination: 'Home',
      bookedBy: []
    };

    const result = service.addRide(ride);
    expect(result).toBeTrue();
    expect(service.getRides().length).toBe(1);
  });

  it('should not allow same employee to add multiple rides', () => {
    const ride = { ...mockRide(), employeeId: 'EMP1' };
    service.addRide(ride);
    const result = service.addRide({ ...ride, id: '2' });
    expect(result).toBeFalse();
  });

  it('should book a ride and reduce seat count', () => {
    service.addRide(mockRide());
    const booked = service.bookRide('1', 'EMP2');

    const updatedRide = service.getRides()[0];
    expect(booked).toBeTrue();
    expect(updatedRide.vacantSeats).toBe(1);
  });

  it('should not allow double booking by same employee', () => {
    service.addRide(mockRide());
    service.bookRide('1', 'EMP2');
    const secondAttempt = service.bookRide('1', 'EMP2');

    expect(secondAttempt).toBeFalse();
  });

  function mockRide(): Ride {
    return {
      id: '1',
      employeeId: 'EMP1',
      vehicleType: 'Car',
      vehicleNo: 'KA01AB1234',
      vacantSeats: 2,
      time: '10:00',
      pickupPoint: 'Office',
      destination: 'Home',
      bookedBy: []
    };
  }
});
