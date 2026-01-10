import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransportService } from '../../services/transport';

@Component({
  selector: 'app-find-ride',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './find-ride.html',
  styleUrls: ['./find-ride.css']
})
export class FindRideComponent {
  private service = inject(TransportService);

  searchTime = signal('');
  searchVehicle = signal('All');
  
  // Booking Modal State
  selectedRideId = signal<string | null>(null);
  bookerId = '';
  bookMsg = '';

  // Filter Logic [cite: 24, 25]
//  filteredRides = computed(() => {
//     // 1. Get the latest rides (automatically updates from Local Storage)
//     const rides = this.service.rides(); 
//     const timeVal = this.searchTime();
//     const typeVal = this.searchVehicle();

//     // Requirement 3: Only show matching times. If no time input, show nothing.
//     if (!timeVal) return [];

//     const searchMins = this.service.timeToMinutes(timeVal);

//     return rides
//       .filter(r => {
//         // Filter 1: Vehicle Type [cite: 25]
//         if (typeVal !== 'All' && r.vehicleType !== typeVal) return false;

//         // Filter 2: Time Buffer +/- 60 mins 
//         const rideMins = this.service.timeToMinutes(r.time);
//         return Math.abs(rideMins - searchMins) <= 60;
//       })
//       // NEW: Sort the results by time (Earliest first)
//       .sort((a, b) => {
//         return this.service.timeToMinutes(a.time) - this.service.timeToMinutes(b.time);
//       });
// });

filteredRides = computed(() => {
    const rides = this.service.rides();
    const timeVal = this.searchTime();
    const typeVal = this.searchVehicle();

    // CHANGE HERE: If no time is selected, don't return empty. 
    // Instead, just skip the time filter and show everything.
    // if (!timeVal) return []; <--- DELETE THIS LINE

    const searchMins = timeVal ? this.service.timeToMinutes(timeVal) : null;

    return rides
      .filter(r => {
        // Filter 1: Vehicle Type
        if (typeVal !== 'All' && r.vehicleType !== typeVal) return false;

        // Filter 2: Time Buffer (Only runs if a time is actually selected)
        if (searchMins !== null) {
          const rideMins = this.service.timeToMinutes(r.time);
          // Check if difference is within 60 mins
          if (Math.abs(rideMins - searchMins) > 60) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        return this.service.timeToMinutes(a.time) - this.service.timeToMinutes(b.time);
      });
});
  // src/app/components/find-ride/find-ride.component.ts

  initBook(id: string) {
    this.selectedRideId.set(id);
    this.bookerId = '';
    this.bookMsg = '';
  }

  confirmBook() {
    if (!this.bookerId) return;
    const res = this.service.bookRide(this.selectedRideId()!, this.bookerId);
    
    if (res.success) {
      alert(res.message);
      this.selectedRideId.set(null);
    } else {
      this.bookMsg = res.message;
    }
  }

  // src/app/components/find-ride/find-ride.component.ts
}