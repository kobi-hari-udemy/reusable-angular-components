import { Component, signal } from '@angular/core';
import { HighlightDirective } from './directives/highlight.directive';

@Component({
  selector: 'app-root',
  imports: [HighlightDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly myColor = signal('teal');
}
