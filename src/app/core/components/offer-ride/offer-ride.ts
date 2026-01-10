import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TransportService } from '../../services/transport';
import { Ride } from '../../models/ride.model';

@Component({
  selector: 'app-offer-ride',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './offer-ride.html',
  styleUrls: ['./offer-ride.css']
})
export class OfferRideComponent {
  private fb = inject(FormBuilder);
  private service = inject(TransportService);

  message = '';
  success = false;

  rideForm = this.fb.group({
    employeeId: ['', Validators.required],
    vehicleType: ['Car', Validators.required],
    vehicleNo: ['', Validators.required],
    vacantSeats: [1, [Validators.required, Validators.min(1)]],
    time: ['', Validators.required],
    pickupPoint: ['', Validators.required],
    destination: ['', Validators.required]
  });

  onSubmit() {
    if (this.rideForm.valid) {
      const newRide: Ride = {
        id: Date.now().toString(), // Simple unique ID
        ...this.rideForm.value as any
      };
      
      const res = this.service.addRide(newRide);
      this.message = res.message;
      this.success = res.success;

      if (this.success) {
        this.rideForm.reset({ vehicleType: 'Car', vacantSeats: 1 });
      }
    }
  }
}