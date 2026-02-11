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
    '(click)': 'toggleActive()'
  },
})
export class HighlightDirective {
  readonly color = input('', {alias: 'highlight'});
  readonly isActive = signal(false);

  readonly bg = computed(() => this.isActive()
    ? 'pink'
    : (this.color() || 'lime')
  )

  toggleActive() {
    this.isActive.update(v => !v);
  }
}
