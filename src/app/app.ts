import { Component } from '@angular/core';
import { Transport } from './features/transport/transport/transport';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Transport],
  template: `
   <div class="container">
    <h1>Transport Facility Management1</h1>
    <app-transport></app-transport>
  </div>
  `
})
export class App{}
