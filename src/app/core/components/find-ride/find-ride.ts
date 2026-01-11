import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms'; 
import { toSignal } from '@angular/core/rxjs-interop'; 
import { TransportService } from '../../services/transport';
import { UpperCaseDirective } from '../../directives/upper-case';
import { OfferRideComponent } from '../offer-ride/offer-ride';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-find-ride',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UpperCaseDirective],
  templateUrl: './find-ride.html',
  styleUrls: ['./find-ride.css']
})
export class FindRideComponent {
  private service = inject(TransportService);
  private fb = inject(FormBuilder);
  
  successMsg = signal('');

  searchForm = this.fb.group({
    time: [''],
    vehicle: ['All']
  });

  bookerControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^EMP[0-9]{1,4}$/), 
    Validators.maxLength(7) 
  ]);

  selectedRideId = signal<string | null>(null);
  showOfferModal = signal(false);


  private searchValues = toSignal(
    this.searchForm.valueChanges.pipe(startWith(this.searchForm.value)), 
    { initialValue: this.searchForm.value }
  );

  filteredRides = computed(() => {
     const rides = this.service.rides();
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

  initBook(id: string) {
    this.selectedRideId.set(id);
    this.bookerControl.reset(); 
  }

  confirmBook() {
    this.bookerControl.markAsTouched();

    if (this.bookerControl.invalid) return;

    const empId = this.bookerControl.value!;
    
    // Call the service
    const res = this.service.bookRide(this.selectedRideId()!, empId);
    
    if (res.success) {
      this.successMsg.set(res.message); 
      this.selectedRideId.set(null); 
      
      // 3 seconds delay
      setTimeout(() => {
        this.successMsg.set('');
      }, 3000);

    } else {
      this.bookerControl.setErrors({ serverError: res.message });
    }
  }
}