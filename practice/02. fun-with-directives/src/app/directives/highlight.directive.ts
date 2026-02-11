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
    '[style.background-color]': 'color()',
    '[style.cursor]': '"pointer"',
  },
})
export class HighlightDirective {
  readonly color = input('', {alias: 'highlight'});
}
