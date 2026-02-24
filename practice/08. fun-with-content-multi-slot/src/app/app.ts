import { Component } from '@angular/core';
import { ExpanderComponent } from './components/expander/expander';

@Component({
  selector: 'app-root',
  imports: [ExpanderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
