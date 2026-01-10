import { Injectable } from '@angular/core';
import { Ride } from '../models/ride.model';

@Injectable({ providedIn: 'root' })
export class RideService {
  private key = 'rides';

  getRides(): Ride[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  saveRides(rides: Ride[]) {
    localStorage.setItem(this.key, JSON.stringify(rides));
  }

  addRide(ride: Ride): boolean {
    const rides = this.getRides();
    if (rides.some(r => r.employeeId === ride.employeeId)) return false;
    rides.push(ride);
    this.saveRides(rides);
    return true;
  }

  bookRide(rideId: string, empId: string): boolean {
    const rides = this.getRides();
    const ride = rides.find(r => r.id === rideId);
    if (!ride) return false;
    if (ride.employeeId === empId) return false;
    if (ride.bookedBy.includes(empId)) return false;
    if (ride.vacantSeats <= 0) return false;

    ride.bookedBy.push(empId);
    ride.vacantSeats--;
    this.saveRides(rides);
    return true;
  }
}
