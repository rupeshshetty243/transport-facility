import { Injectable, signal } from '@angular/core';
import { Ride } from '../models/ride.model';

@Injectable({
  providedIn: 'root'
})
export class TransportService {
  private readonly STORAGE_KEY = 'transport_app_rides';

  private ridesSignal = signal<Ride[]>(this.loadFromStorage());
  readonly rides = this.ridesSignal.asReadonly();

  private loadFromStorage(): Ride[] {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return [];
  }

  private saveToStorage(rides: Ride[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(rides));
  }

  // --- Add a New Ride ---
  addRide(newRide: Ride): { success: boolean; message: string } {
    const currentRides = this.ridesSignal();

    const alreadyPosted = currentRides.some(r => r.employeeId === newRide.employeeId);
    if (alreadyPosted) {
      return { success: false, message: 'You have already posted a ride for today.' };
    }

    // Initialize the bookedUsers array for the new ride
    const rideWithStorage = { ...newRide, bookedUsers: [] };

    this.ridesSignal.update(rides => {
      const updatedList = [...rides, rideWithStorage];
      this.saveToStorage(updatedList); 
      return updatedList;
    });

    return { success: true, message: 'Ride published successfully!' };
  }

  // --- FIXED: Book a Ride ---
  bookRide(rideId: string, bookerId: string): { success: boolean; message: string } {
    const currentRides = this.ridesSignal();
    const rideIndex = currentRides.findIndex(r => r.id === rideId);
    
    if (rideIndex === -1) return { success: false, message: 'Ride not found.' };
    
    const ride = currentRides[rideIndex];

    // 1. Initialize array if it's missing (handling old data from local storage)
    const currentBookedUsers = ride.bookedUsers || [];

    // 2. CHECK: Is this user already in the list?
    if (currentBookedUsers.includes(bookerId)) {
      return { success: false, message: 'You have already booked this ride!' };
    }

    // 3. CHECK: Is the user the Host?
    if (ride.employeeId === bookerId) {
      return { success: false, message: 'You cannot book your own ride.' };
    }

    // 4. CHECK: Seats available
    if (ride.vacantSeats <= 0) {
      return { success: false, message: 'No seats available.' };
    }

    // UPDATE STATE & STORAGE
    this.ridesSignal.update(rides => {
      const updatedRides = [...rides];
      
      updatedRides[rideIndex] = { 
        ...ride, 
        vacantSeats: ride.vacantSeats - 1,
        // Add the booker to the list
        bookedUsers: [...currentBookedUsers, bookerId] 
      };
      
      this.saveToStorage(updatedRides);
      return updatedRides;
    });

    return { success: true, message: 'Booking confirmed!' };
  }

  timeToMinutes(timeStr: string): number {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }
}