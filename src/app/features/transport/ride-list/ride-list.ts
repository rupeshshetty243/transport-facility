import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RideService } from '../../../core/services/ride.service';
import { BookRide } from '../book-ride/book-ride';

@Component({
  selector: 'app-ride-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BookRide],
  templateUrl: './ride-list.html'
})
export class RideList implements OnInit {
  rides:any = [];
  selectedTime = '';

  constructor(private service: RideService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.rides = this.service.getRides();
  }
}
