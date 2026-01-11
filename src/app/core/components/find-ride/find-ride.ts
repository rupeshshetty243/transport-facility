import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransportService } from '../../services/transport';
import { UpperCaseDirective } from '../../directives/upper-case';
import { OfferRideComponent } from '../offer-ride/offer-ride';

@Component({
  selector: 'app-find-ride',
  standalone: true,
  // 2. Add it to imports
  imports: [CommonModule, FormsModule, UpperCaseDirective, OfferRideComponent], 
  templateUrl: './find-ride.html',
  styleUrls: ['./find-ride.css']
})
export class FindRideComponent {
  private service = inject(TransportService);
  
  // --- Search Signals ---
  searchTime = signal('');
  searchVehicle = signal('All');
  
  // --- Booking Modal State ---
  selectedRideId = signal<string | null>(null);
  bookerId = '';
  bookMsg = '';

  // --- NEW: Offer Ride Modal State ---
  showOfferModal = signal(false);

  // Define regex for validations
  private readonly empRegex = /^EMP[0-9]{1,4}$/;

  // ... (Your formatTime and filteredRides logic stays the same) ...
  
  formatTime(time24: string): string {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; 
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  filteredRides = computed(() => {
     // ... (Keep your existing filtering logic here) ...
     const rides = this.service.rides();
     const timeVal = this.searchTime();
     const typeVal = this.searchVehicle();

     if (!timeVal) return [];

     const searchMins = this.service.timeToMinutes(timeVal);

     return rides.filter(r => {
        if (typeVal !== 'All' && r.vehicleType !== typeVal) return false;
        const rideMins = this.service.timeToMinutes(r.time);
        if (Math.abs(rideMins - searchMins) > 60) return false;
        return true;
     }).sort((a, b) => this.service.timeToMinutes(a.time) - this.service.timeToMinutes(b.time));
  });

  // --- Actions ---
  
  initBook(id: string) {
    this.selectedRideId.set(id);
    this.bookerId = '';
    this.bookMsg = '';
  }

  confirmBook() {
    if (!this.bookerId.trim()) {
      this.bookMsg = 'Employee ID is required.';
      return;
    }
    if (!this.empRegex.test(this.bookerId)) {
      this.bookMsg = "Invalid Format. Must be 'EMP' followed by digits.";
      return;
    }

    const res = this.service.bookRide(this.selectedRideId()!, this.bookerId);
    
    if (res.success) {
      alert(res.message);
      this.selectedRideId.set(null);
    } else {
      this.bookMsg = res.message;
    }
  }
}