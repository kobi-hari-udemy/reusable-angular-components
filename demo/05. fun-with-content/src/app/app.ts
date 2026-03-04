import { Component } from '@angular/core';
import { Icon } from './components/icon/icon';
import { Expander } from './components/expander/expander';
import { Blank } from './components/blank/blank';

@Component({
  selector: 'app-root',
  imports: [Expander, Icon, Blank],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
