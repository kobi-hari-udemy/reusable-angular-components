import { Component } from '@angular/core';
import { Capitalize } from './directives/capitalize.directive';

@Component({
  selector: 'app-root',
  imports: [Capitalize],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
