import { computed, Directive, ElementRef, inject, Renderer2, signal } from '@angular/core';

@Directive({
  selector: '[highlight]',
  host: {
    '[attr.tabindex]': '0',
    '[style.background-color]': 'bg()',
    '[style.cursor]': '"pointer"',
    '(click)': 'changeColor()',
    '(keyup.shift.enter)': 'onKeyPressed($event)',
  },
})
export class HighlightDirective {
  readonly bg = signal('lime');

  onKeyPressed(ev: Event) {
    console.log('A key was pressed', ev);
  }

  changeColor() {
    this.bg.set('pink');
  }
}
