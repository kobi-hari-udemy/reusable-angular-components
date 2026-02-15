import { Component, signal } from '@angular/core';
import { HighlightDirective } from './directives/highlight.directive';
import { UnderlineDirective } from './directives/underline.directive';
import { DecorateDirective } from './directives/decorate.directive';

@Component({
  selector: 'app-root',
  imports: [HighlightDirective, UnderlineDirective, DecorateDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly myColor = signal('magenta');

  onDeactivation(timeLength: number) {
    const seconds = timeLength / 1000;
    console.log(`Highlight Deactived after ${seconds} seconds`);
  }
}
