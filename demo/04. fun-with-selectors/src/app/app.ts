import { Component } from '@angular/core';
import { Capitalize } from './directives/capitalize.directive';
import { ImageAlt } from './directives/image-alt.directive';

@Component({
  selector: 'app-root',
  imports: [Capitalize, ImageAlt],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
