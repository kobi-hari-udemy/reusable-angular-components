import { Component } from '@angular/core';
import { Capitalize } from './directives/capitalize.directive';
import { ImageAlt } from './directives/image-alt.directive';
import { CrazyButton } from './components/crazy-button.component';

@Component({
  selector: 'app-root',
  imports: [Capitalize, ImageAlt, CrazyButton],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
