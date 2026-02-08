import { computed, Directive, ElementRef, inject, Renderer2, signal } from '@angular/core';

@Directive({
  selector: '[highlight]',
  host: {
    '[style.background-color]': 'bg()',
    '[style.cursor]': '"pointer"',
    '(click)': 'changeColor()'
  },
})
export class HighlightDirective {
  readonly bg = signal('lime');

  changeColor() {
    this.bg.set('pink');
  }
}
