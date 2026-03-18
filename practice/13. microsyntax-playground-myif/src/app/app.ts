import { Component, signal } from '@angular/core';
import { MyIf } from './directives/my-if.directive';
import { CommonModule } from '@angular/common';
import { Point } from './models/point';

@Component({
  selector: 'app-root',
  imports: [CommonModule, MyIf],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly flag = signal(true);
  readonly obj = signal<Point | null>({x: 20, y: 30});

  toggleFlag() {
    this.flag.update(v => !v);
  }

  toggleObj() {
    this.obj.update(v => (!!v) ? null : {x: 20, y: 30});
  }
}
