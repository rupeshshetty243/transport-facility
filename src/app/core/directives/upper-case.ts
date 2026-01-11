import { Directive, HostListener, ElementRef, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUpperCase]', 
  standalone: true
})
export class UpperCaseDirective {
  private el = inject(ElementRef);
  private control = inject(NgControl, { optional: true });

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = this.el.nativeElement as HTMLInputElement;
    
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const upperValue = input.value.toUpperCase();

    input.value = upperValue;

    if (this.control && this.control.control) {
      this.control.control.setValue(upperValue, { emitEvent: false });
    }

    input.setSelectionRange(start, end);
  }
}