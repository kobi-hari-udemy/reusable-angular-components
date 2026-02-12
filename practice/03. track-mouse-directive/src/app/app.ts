import { Component } from '@angular/core';
import { TrackMouse } from './directives/track-mouse.directive';

@Component({
  selector: 'app-root',
  imports: [TrackMouse],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
