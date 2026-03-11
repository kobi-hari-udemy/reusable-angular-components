import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Repeater } from './components/repeater/repeater';
import { AbcDirective } from './abc.directive';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Repeater, AbcDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
