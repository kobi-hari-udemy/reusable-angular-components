import { computed, Directive, ElementRef, inject, input, linkedSignal, Renderer2, signal } from '@angular/core';

@Directive({
  selector: '[highlight]',
  host: {
    '[style.background-color]': 'bg()',
    '[style.cursor]': '"pointer"',
    '(click)': 'changeColor()',
  },
})
export class HighlightDirective {
  readonly color = input('lime');

  readonly bg = linkedSignal(this.color);

  changeColor() {
    this.bg.set('pink');
  }
}
