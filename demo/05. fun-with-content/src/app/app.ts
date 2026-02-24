import { Component } from '@angular/core';
import { ExpanderComponent } from './components/expander/expander';
import { Icon } from './components/icon/icon';

@Component({
  selector: 'app-root',
  imports: [ExpanderComponent, Icon],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
