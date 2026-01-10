import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RideService } from '../../../core/services/ride.service';
import { Ride } from '../../../core/models/ride.model';
import { BookRide } from '../book-ride/book-ride';

@Component({
  selector: 'app-ride-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BookRide],
  templateUrl: './ride-list.html',
  styleUrls: ['./ride-list.css']
})
export class RideList implements OnInit {

  allRides: Ride[] = [];
  filteredRides: Ride[] = [];

  selectedTime: string = '';
  selectedVehicle: 'All' | 'Car' | 'Bike' = 'All';

  constructor(private rideService: RideService) {}

  ngOnInit(): void {
    this.loadRides();
  }

  loadRides(): void {
    this.allRides = this.rideService.getRides();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredRides = this.allRides.filter(ride => {

      // Hide rides with no seats
      if (ride.vacantSeats <= 0) {
        return false;
      }

      // Vehicle filter
      if (this.selectedVehicle !== 'All' &&
          ride.vehicleType !== this.selectedVehicle) {
        return false;
      }

      // Time filter (+/- 60 minutes)
      if (this.selectedTime) {
        return this.isWithinTimeBuffer(ride.time, this.selectedTime);
      }

      return true;
    });
  }

  private isWithinTimeBuffer(rideTime: string, selectedTime: string): boolean {
    const toMinutes = (time: string): number => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    const rideMinutes = toMinutes(rideTime);
    const selectedMinutes = toMinutes(selectedTime);

    return Math.abs(rideMinutes - selectedMinutes) <= 60;
  }
}
