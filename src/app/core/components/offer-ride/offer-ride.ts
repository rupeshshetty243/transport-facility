import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  
  // FIXED: Renamed 'commonLocations' to 'locations' to match your HTML
  locations: string[] = [
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

  rideForm = this.fb.group({
    employeeId: ['', [Validators.required, Validators.pattern(/^EMP[0-9]{1,4}$/), Validators.maxLength(7)]],
    vehicleType: ['Car', Validators.required],
    vehicleNo: ['', [Validators.required, Validators.pattern(this.vehicleRegex)]],
    vacantSeats: [1, [Validators.required, Validators.min(1), Validators.max(5)]], // Default max to 5 (Car)
    time: ['', [Validators.required, this.futureTimeValidator]], 
    pickupPoint: ['', Validators.required], 
    destination: ['', Validators.required],
  }, { 
    validators: this.pickupDestinationValidator 
  });

  // --- CUSTOM VALIDATORS ---

  futureTimeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const [inputHours, inputMinutes] = control.value.split(':').map(Number);
    const now = new Date();
    
    // Convert times to minutes for easy comparison
    const currentTotalMinutes = (now.getHours() * 60) + now.getMinutes();
    const inputTotalMinutes = (inputHours * 60) + inputMinutes;

    if (inputTotalMinutes <= currentTotalMinutes) {
      return { pastTime: true };
    }
    return null;
  }

  pickupDestinationValidator(group: AbstractControl): ValidationErrors | null {
    const pickup = group.get('pickupPoint')?.value;
    const dest = group.get('destination')?.value;

    if (pickup && dest && pickup === dest) {
      return { sameLocation: true };
    }
    return null;
  }

  // --- LIFECYCLE HOOKS ---

  ngOnInit() {
    this.sub = this.rideForm.get('vehicleType')!.valueChanges.subscribe(type => {
      this.updateSeatValidators(type);
    });
  }

  updateSeatValidators(type: string | null) {
    const seatControl = this.rideForm.get('vacantSeats');
    
    if (type === 'Bike') {
      seatControl?.setValidators([Validators.required, Validators.min(1), Validators.max(1)]);
    } else {
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
        // Reset form but keep defaults
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