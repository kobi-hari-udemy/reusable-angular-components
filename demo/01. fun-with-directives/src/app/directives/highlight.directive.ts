import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
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
  exportAs: 'highlight'
})
export class HighlightDirective {
  readonly color = input('', {alias: 'highlight'});
  readonly isActive = signal(false);

  readonly highlightActivated = output<void>();
  readonly highlightDeactivated = output<number>();

  #activationTime = -1;

  readonly bg = computed(() => this.isActive()
    ? 'pink'
    : (this.color() || 'lime')
  )

  toggleActive() {
    this.isActive.update(v => !v);

    if (this.isActive()) {
      this.highlightActivated.emit();
      this.#activationTime = Date.now();
    } else {
      const timeSince = Date.now() - this.#activationTime;
      this.#activationTime = -1;
      this.highlightDeactivated.emit(timeSince);
    }

  }
}
