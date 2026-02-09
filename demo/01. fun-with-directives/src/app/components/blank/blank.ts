import { Component, effect, input } from '@angular/core';

@Component({
  selector: 'app-blank',
  imports: [],
  templateUrl: './blank.html',
  styleUrl: './blank.scss',
})
export class Blank {
  readonly color = input('blue');

  constructor() {
    effect(() => {
      console.log('Blank Component Color = ', this.color());
    })
  }

}
