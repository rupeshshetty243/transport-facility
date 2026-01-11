import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferRideComponent } from './core/components/offer-ride/offer-ride';
import { FindRideComponent } from './core/components/find-ride/find-ride';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, OfferRideComponent, FindRideComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  // State to control popup visibility
  isOfferModalOpen = false;

  openModal() {
    this.isOfferModalOpen = true;
  }

  closeModal() {
    this.isOfferModalOpen = false;
  }
}