import { Component } from '@angular/core';
import { AddRide } from '../add-ride/add-ride';
import { RideList } from '../ride-list/ride-list';

@Component({
  selector: 'app-transport',
  standalone: true,
  imports: [AddRide, RideList],
  template: `
    <app-add-ride></app-add-ride>
    <app-ride-list></app-ride-list>
  `
})
export class Transport {}
