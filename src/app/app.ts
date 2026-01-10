import { Component } from '@angular/core';
import { Transport } from './features/transport/transport/transport';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Transport],
  template: `
    <h1>Transport Facility Management</h1>
    <app-transport></app-transport>
  `
})
export class App{}
