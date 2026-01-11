import { Directive, HostListener, ElementRef, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUpperCase]', // This is the HTML attribute name
  standalone: true
})
export class UpperCaseDirective {
  // Access the DOM element
  private el = inject(ElementRef);
  // Optional: Access the Angular Form Control (if used with Reactive Forms)
  private control = inject(NgControl, { optional: true });

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = this.el.nativeElement as HTMLInputElement;
    
    // 1. Get current cursor position (prevents cursor jumping to end)
    const start = input.selectionStart;
    const end = input.selectionEnd;

    // 2. Convert to Uppercase
    const upperValue = input.value.toUpperCase();

    // 3. Update the DOM value visually
    input.value = upperValue;

    // 4. Update the Angular Form Control (Model)
    // { emitEvent: false } prevents infinite loops
    if (this.control && this.control.control) {
      this.control.control.setValue(upperValue, { emitEvent: false });
    }

    // 5. Restore cursor position
    input.setSelectionRange(start, end);
  }
}