import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransportService } from '../../services/transport';
import { UpperCaseDirective } from '../../directives/upper-case';

@Component({
  selector: 'app-find-ride',
  standalone: true,
  imports: [CommonModule, FormsModule, UpperCaseDirective],
  templateUrl: './find-ride.html',
  styleUrls: ['./find-ride.css']
})
export class FindRideComponent {
  private service = inject(TransportService);

  searchTime = signal('');
  searchVehicle = signal('All');
   private readonly empRegex = /^EMP[0-9]{1,4}$/;
  // Booking Modal State
  selectedRideId = signal<string | null>(null);
  bookerId = '';
  bookMsg = '';


  confirmBook() {
     // A. Check if empty
    if (!this.bookerId.trim()) {
      this.bookMsg = 'Employee ID is required.';
      return;
    }

    // B. Check Pattern (The "Same Validation")
    if (!this.empRegex.test(this.bookerId)) {
      this.bookMsg = "Invalid Format. Must be 'EMP' followed by digits (e.g. EMP001).";
      return;
    }

    // C. Proceed if valid
    const res = this.service.bookRide(this.selectedRideId()!, this.bookerId);
    
    if (res.success) {
      alert(res.message);
      this.selectedRideId.set(null);
    } else {
      this.bookMsg = res.message;
    }
  }


  formatTime(time24: string): string {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Converts 0 to 12, 13 to 1, etc.
    
    // Returns formatted string
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
 
filteredRides = computed(() => {
    const rides = this.service.rides();
    const timeVal = this.searchTime();    // User input
    const typeVal = this.searchVehicle(); // "Car", "Bike", or "All"

    // 1. RULE: If no time is selected, show NOTHING.
    if (!timeVal) {
      return [];
    }

    // 2. Convert search time to minutes
    const searchMins = this.service.timeToMinutes(timeVal);

    return rides
      .filter(r => {
        // Filter A: Vehicle Type
        if (typeVal !== 'All' && r.vehicleType !== typeVal) {
          return false;
        }

        // Filter B: Time Buffer (+/- 60 mins)
        const rideMins = this.service.timeToMinutes(r.time);
        
        // Math.abs gets the difference (positive number)
        if (Math.abs(rideMins - searchMins) > 60) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort results by time
        return this.service.timeToMinutes(a.time) - this.service.timeToMinutes(b.time);
      });
});

  initBook(id: string) {
    this.selectedRideId.set(id);
    this.bookerId = '';
    this.bookMsg = '';
  }
}