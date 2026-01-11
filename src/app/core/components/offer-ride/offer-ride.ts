import { Component, inject, OnInit, OnDestroy, HostListener, Output, EventEmitter } from '@angular/core';
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
  
  @Output() close = new EventEmitter<void>();

  locations: string[] = [
    'Office - BTM 2nd Stage', 'Silk Board Junction', 'HSR Layout BDA Complex',
    'Marathahalli Bridge', 'Whitefield ITPL', 'Koramangala Sony World',
    'Indiranagar Metro', 'Hebbal Flyover', 'Electronic City Phase 1'
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
    vacantSeats: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
    time: ['', [Validators.required, this.futureTimeValidator]], 
    pickupPoint: ['', Validators.required], 
    destination: ['', Validators.required],
  }, { validators: this.pickupDestinationValidator });

  
  // --- VALIDATORS ---
  futureTimeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const [h, m] = control.value.split(':').map(Number);
    const now = new Date();
    const curMins = (now.getHours() * 60) + now.getMinutes();
    const inMins = (h * 60) + m;
    return inMins <= curMins ? { pastTime: true } : null;
  }

  pickupDestinationValidator(group: AbstractControl): ValidationErrors | null {
    const p = group.get('pickupPoint')?.value;
    const d = group.get('destination')?.value;
    return (p && d && p === d) ? { sameLocation: true } : null;
  }

  ngOnInit() {
    this.sub = this.rideForm.get('vehicleType')!.valueChanges.subscribe(type => {
      this.updateSeatValidators(type);
    });
  }

  updateSeatValidators(type: string | null) {
    const seatControl = this.rideForm.get('vacantSeats');
    const max = type === 'Bike' ? 1 : 5;
    seatControl?.setValidators([Validators.required, Validators.min(1), Validators.max(max)]);
    seatControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.rideForm.valid) {
      const newRide: Ride = {
        id: Date.now().toString(),
        ...this.rideForm.value as any
      };
      
      const res = this.service.addRide(newRide);
      
      this.success = res.success;
      this.message = res.message;

      if (this.success) {
        // Disable the form 
        this.rideForm.disable();

        // 2 seconds of delay, close the modal and reset the form
        setTimeout(() => {
          this.close.emit(); 
          
          this.rideForm.enable();
          this.rideForm.reset({ vehicleType: 'Car', vacantSeats: 1 });
          this.message = ''; 
        }, 2000);
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