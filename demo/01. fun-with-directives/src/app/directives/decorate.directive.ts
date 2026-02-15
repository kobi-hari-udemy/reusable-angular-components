import {
  Directive,
  input,
} from '@angular/core';
import { HighlightDirective } from './highlight.directive';
import { UnderlineDirective } from './underline.directive';

@Directive({
  selector: '[decorate]',
  hostDirectives: [
    UnderlineDirective, 
    {
      directive: HighlightDirective, 
      inputs: [
        'highlight: decorate'
      ]
      
    }
  ]
})
export class DecorateDirective {
}
