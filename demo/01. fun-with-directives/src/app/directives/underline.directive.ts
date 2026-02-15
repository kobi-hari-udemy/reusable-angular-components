import {
  Directive,
} from '@angular/core';

@Directive({
  selector: '[underline]',
  host: {
    '[style.text-decoration]': '"underline"',
  },
})
export class UnderlineDirective {
}
