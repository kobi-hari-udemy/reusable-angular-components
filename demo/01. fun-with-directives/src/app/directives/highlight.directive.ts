import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  Renderer2,
  signal,
} from '@angular/core';

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

  constructor() {
    effect(() => {
      console.log('Highlight Directive Color = ', this.color());
    });
  }
}
