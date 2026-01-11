import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms'; // 1. Import Reactive parts
import { toSignal } from '@angular/core/rxjs-interop'; // 2. Import toSignal for filtering
import { TransportService } from '../../services/transport';
import { UpperCaseDirective } from '../../directives/upper-case';
import { OfferRideComponent } from '../offer-ride/offer-ride';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-find-ride',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UpperCaseDirective, OfferRideComponent], // 3. Use ReactiveFormsModule
  templateUrl: './find-ride.html',
  styleUrls: ['./find-ride.css']
})
export class FindRideComponent {
  private service = inject(TransportService);
  private fb = inject(FormBuilder);
  
  // --- 1. Search Form Group ---
  searchForm = this.fb.group({
    time: [''],
    vehicle: ['All']
  });

  // --- 2. Booking Control (Single FormControl) ---
  // This validates: Required + Starts with EMP/Digits + Max 7 chars
  bookerControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^EMP[0-9]{1,4}$/), 
    Validators.maxLength(7) 
  ]);

  // --- Modal State ---
  selectedRideId = signal<string | null>(null);
  showOfferModal = signal(false);

  // --- Filter Logic ---
  // Convert form changes into a Signal so 'filteredRides' updates automatically
  private searchValues = toSignal(
    this.searchForm.valueChanges.pipe(
      startWith(this.searchForm.value) // Ensure it has data on load
    ), 
    { initialValue: this.searchForm.value }
  );

  filteredRides = computed(() => {
     const rides = this.service.rides();
     // Read values from our new signal
     const { time, vehicle } = this.searchValues(); 

     if (!time) return [];

     const searchMins = this.service.timeToMinutes(time);

     return rides.filter(r => {
        if (vehicle !== 'All' && r.vehicleType !== vehicle) return false;
        
        const rideMins = this.service.timeToMinutes(r.time);
        if (Math.abs(rideMins - searchMins) > 60) return false;
        
        return true;
     }).sort((a, b) => this.service.timeToMinutes(a.time) - this.service.timeToMinutes(b.time));
  });

  // --- Actions ---

  initBook(id: string) {
    this.selectedRideId.set(id);
    this.bookerControl.reset(); // Clear previous input
  }

confirmBook() {
  this.bookerControl.markAsTouched();

  if (this.bookerControl.invalid) return;

  const empId = this.bookerControl.value!;
  
  // Call the service
  const res = this.service.bookRide(this.selectedRideId()!, empId);
  
  if (res.success) {
    alert(res.message);
    this.selectedRideId.set(null); // Close modal on success
  } else {
    // This will display "Duplicate: You have already booked this ride."
    // right under the input box
    this.bookerControl.setErrors({ serverError: res.message });
  }
}
}