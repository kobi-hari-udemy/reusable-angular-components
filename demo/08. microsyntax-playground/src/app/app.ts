import { Component, signal } from '@angular/core';
import { MyFor } from './directives/my-for.directive';
import { MyIf } from './directives/my-if.directive';
import { MyRepeat } from './directives/my-repeat.directive';
import { MyTimer } from './directives/my-timer.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, MyFor, MyIf, MyRepeat, MyTimer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly times = signal(50);

  readonly value = signal<string | null>(null);

  readonly items = signal(['a', 'b', 'c']);
}
