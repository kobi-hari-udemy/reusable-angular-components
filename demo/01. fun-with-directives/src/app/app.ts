import { Component, signal } from '@angular/core';
import { HighlightDirective } from './directives/highlight.directive';
import { Blank } from './components/blank/blank';

@Component({
  selector: 'app-root',
  imports: [HighlightDirective, Blank],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly myColor = signal('magenta');
}
