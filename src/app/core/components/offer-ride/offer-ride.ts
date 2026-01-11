import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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
  commonLocations = [
    'Office - Eco Space',
    'Silk Board Junction',
    'HSR Layout BDA Complex',
    'Marathahalli Bridge',
    'Whitefield ITPL',
    'Koramangala Sony World',
    'Indiranagar Metro',
    'Hebbal Flyover',
    'Electronic City Phase 1'
  ];

  private fb = inject(FormBuilder);
  private service = inject(TransportService);
  private sub!: Subscription;

  message = '';
  success = false;

  private readonly vehicleRegex = /^[A-Z]{2}[ -]?[0-9]{1,2}[ -]?[A-Z]{1,2}[ -]?[0-9]{4}$/;
  private readonly empIdRegex = /^EMP[0-9]{1,4}$/;

  allowedLocationValidator(allowedList: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null; // Let required validator handle empty strings

      // Check if the current value exists in the allowed list
      const isValid = allowedList.includes(value);

      return isValid ? null : { invalidLocation: true };
    };
  }

  rideForm = this.fb.group({
    employeeId: ['', [Validators.required, Validators.pattern(/^EMP[0-9]{1,4}$/), Validators.maxLength(7)]],
    vehicleType: ['Car', Validators.required],
    vehicleNo: ['', [Validators.required, Validators.pattern(this.vehicleRegex)]],
    vacantSeats: [1, [Validators.required, Validators.min(1), Validators.max(6)]],
    time: ['', [Validators.required, this.futureTimeValidator]], 
    
    // --- 2. APPLY THE VALIDATOR HERE ---
    pickupPoint: ['', [
      Validators.required, 
      this.allowedLocationValidator(this.commonLocations) // Pass the list
    ]],
    destination: ['', [
      Validators.required, 
      this.allowedLocationValidator(this.commonLocations) // Pass the list
    ]]
  }, { 
    validators: this.pickupDestinationValidator 
  });

  // --- LOGIC FOR VALIDATOR A (Past Time) ---
  futureTimeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const [inputHours, inputMinutes] = control.value.split(':').map(Number);
    const now = new Date();
    
    // Convert current time to minutes (e.g., 14:00 = 840 mins)
    const currentTotalMinutes = (now.getHours() * 60) + now.getMinutes();
    const inputTotalMinutes = (inputHours * 60) + inputMinutes;

    // If input is less than or equal to now, it's invalid
    if (inputTotalMinutes <= currentTotalMinutes) {
      return { pastTime: true };
    }
    return null;
  }

  // --- LOGIC FOR VALIDATOR B (Same Location) ---
  pickupDestinationValidator(group: AbstractControl): ValidationErrors | null {
    const pickup = group.get('pickupPoint')?.value;
    const dest = group.get('destination')?.value;

    // Check if both exist and are effectively equal
    if (pickup && dest && pickup.trim().toLowerCase() === dest.trim().toLowerCase()) {
      return { sameLocation: true };
    }
    return null;
  }

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