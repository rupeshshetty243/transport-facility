import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ride } from '../../../core/models/ride.model';
import { RideService } from '../../../core/services/ride.service';

@Component({
  selector: 'app-book-ride',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-ride.html'
})
export class BookRide {
  @Input() ride!: Ride;
  empId = '';

  constructor(private service: RideService) {}

  book() {
    const ok = this.service.bookRide(this.ride.id, this.empId);
    alert(ok ? 'Booked' : 'Booking failed');
    this.empId = '';
  }
}
