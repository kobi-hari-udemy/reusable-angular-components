import { Directive, ElementRef, inject, signal } from '@angular/core';
import { clamp } from './helpers';

@Directive({
  selector: '[track-mouse]',
  host: {
    '(mousemove)': 'mouseMoved($event)', 
    '[style.--mouse-x.px]': 'x()', 
    '[style.--mouse-y.px]': 'y()'
  }, 
  exportAs: 'track-mouse'
})
export class TrackMouse {
  readonly x = signal(0);
  readonly y = signal(0);

  readonly elem = inject(ElementRef).nativeElement as HTMLElement;

  mouseMoved(ev: MouseEvent) {
    const rect = this.elem.getBoundingClientRect();
    const x = clamp(0, ev.clientX - rect.left, rect.width);
    const y = clamp(0, ev.clientY - rect.top, rect.height);

    this.x.set(x);
    this.y.set(y);

    console.log(x, y);

  }
}
