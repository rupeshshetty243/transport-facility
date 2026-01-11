import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TransportService } from '../../services/transport';
import { Ride } from '../../models/ride.model';
import { Subscription } from 'rxjs';
import { UpperCaseDirective } from '../../directives/upper-case';

@Component({
  selector: 'app-offer-ride',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UpperCaseDirective],
  templateUrl: './offer-ride.html',
  styleUrls: ['./offer-ride.css'] 
})
export class OfferRideComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private service = inject(TransportService);
  private sub!: Subscription;

  message = '';
  success = false;

  private readonly vehicleRegex = /^[A-Z]{2}[ -]?[0-9]{1,2}[ -]?[A-Z]{1,2}[ -]?[0-9]{4}$/;
  private readonly empIdRegex = /^EMP[0-9]{1,4}$/;

  rideForm = this.fb.group({
  // UPDATED VALIDATORS HERE
  employeeId: ['', [
    Validators.required, 
    Validators.pattern(this.empIdRegex), 
    Validators.maxLength(7)          
  ]],
  
  vehicleType: ['Car', Validators.required],
  vehicleNo: ['', [Validators.required, Validators.pattern(this.vehicleRegex)]],
  vacantSeats: [1, [Validators.required, Validators.min(1), Validators.max(6)]],
  time: ['', Validators.required],
  pickupPoint: ['', Validators.required],
  destination: ['', Validators.required]
});

  ngOnInit() {
    this.sub = this.rideForm.get('vehicleType')!.valueChanges.subscribe(type => {
      this.updateSeatValidators(type);
    });
  }

  updateSeatValidators(type: string | null) {
    const seatControl = this.rideForm.get('vacantSeats');
    
    if (type === 'Bike') {
      // Max 1 seats for Bike
      seatControl?.setValidators([Validators.required, Validators.min(1), Validators.max(1)]);
    } else {
      // Max 5 seats for Car
      seatControl?.setValidators([Validators.required, Validators.min(1), Validators.max(5)]);
    }
    
    seatControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.rideForm.valid) {
      const newRide: Ride = {
        id: Date.now().toString(),
        ...this.rideForm.value as any
      };
      
      const res = this.service.addRide(newRide);
      this.message = res.message;
      this.success = res.success;

      if (this.success) {
        this.rideForm.reset({ vehicleType: 'Car', vacantSeats: 1 });
      }
    } else {
      this.message = "Please fix the errors in the form.";
      this.success = false;
    }
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  get v() {
     return this.rideForm.controls; 
    }
}