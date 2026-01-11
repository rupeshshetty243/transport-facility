import { Injectable, signal } from '@angular/core';
import { Ride } from '../models/ride.model';

@Injectable({
  providedIn: 'root'
})
export class TransportService {
  private readonly STORAGE_KEY = 'transport_app_rides';

  // 1. Initialize State: Try loading from Local Storage first.
  // If storage is empty, fall back to the dummy data for the demo.
  private ridesSignal = signal<Ride[]>(this.loadFromStorage());

  // Expose read-only access for components
  readonly rides = this.ridesSignal.asReadonly();

  /**
   * HELPER: Load data from browser storage or return default data
   */
  private loadFromStorage(): Ride[] {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    // Default dummy data for the first run
    return [
    ];
  }

  /**
   * HELPER: Save current state to browser storage
   */
  private saveToStorage(rides: Ride[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(rides));
  }

  // --- FUNCTIONALITY: Add a New Ride ---
  addRide(newRide: Ride): { success: boolean; message: string } {
    const currentRides = this.ridesSignal();

    // Check for unique Employee ID (Constraint: One ride per employee)
    const alreadyPosted = currentRides.some(r => r.employeeId === newRide.employeeId);
    if (alreadyPosted) {
      return { success: false, message: 'You have already posted a ride for today.' };
    }

    // UPDATE STATE & STORAGE
    this.ridesSignal.update(rides => {
      const updatedList = [...rides, newRide];
      this.saveToStorage(updatedList); // <--- Save occurs here
      return updatedList;
    });

    return { success: true, message: 'Ride published successfully!' };
  }

  // --- FUNCTIONALITY: Book a Ride ---
  bookRide(rideId: string, bookerId: string): { success: boolean; message: string } {
    const currentRides = this.ridesSignal();
    const rideIndex = currentRides.findIndex(r => r.id === rideId);
    
    if (rideIndex === -1) return { success: false, message: 'Ride not found.' };
    
    const ride = currentRides[rideIndex];

    // Validation Rules
    if (ride.employeeId === bookerId) {
      return { success: false, message: 'You cannot book your own ride.' };
    }
    if (ride.vacantSeats <= 0) {
      return { success: false, message: 'No seats available.' };
    }

    // UPDATE STATE & STORAGE
    this.ridesSignal.update(rides => {
      const updatedRides = [...rides];
      // Create new object with decremented seats
      updatedRides[rideIndex] = { ...ride, vacantSeats: ride.vacantSeats - 1 };
      
      this.saveToStorage(updatedRides); // <--- Save occurs here
      return updatedRides;
    });

    return { success: true, message: 'Booking confirmed!' };
  }

  // Utility for time calculation
  timeToMinutes(timeStr: string): number {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }
}