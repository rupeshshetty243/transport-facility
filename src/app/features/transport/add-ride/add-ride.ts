import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RideService } from '../../../core/services/ride.service';

@Component({
  selector: 'app-add-ride',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-ride.html'
})
export class AddRide {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: RideService
  ) {
    // ✅ Form MUST be created here
    this.form = this.fb.group({
      employeeId: ['', Validators.required],
      vehicleType: ['Car', Validators.required],
      vehicleNo: ['', Validators.required],
      vacantSeats: [1, [Validators.required, Validators.min(1)]],
      time: ['', Validators.required],
      pickupPoint: ['', Validators.required],
      destination: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;

    const success = this.service.addRide({
      ...this.form.value,
      id: crypto.randomUUID(),
      bookedBy: []
    } as any);

    alert(success ? 'Ride Added' : 'Employee already added ride');
    this.form.reset();
  }
}
