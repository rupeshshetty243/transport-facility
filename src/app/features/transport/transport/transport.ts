import { Component } from '@angular/core';
import { AddRide } from '../add-ride/add-ride';
import { RideList } from '../ride-list/ride-list';

@Component({
  selector: 'app-transport',
  standalone: true,
  imports: [AddRide, RideList],
  template: `
    <h2>Add Ride</h2>
    <app-add-ride></app-add-ride>

    <h2>Available Rides</h2>
    <app-ride-list></app-ride-list>
  `
})
export class Transport {}
