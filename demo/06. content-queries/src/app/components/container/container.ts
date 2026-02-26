import { Component, contentChild, contentChildren, effect, ElementRef } from '@angular/core';
import { Item } from '../item/item';

@Component({
  selector: 'app-container',
  imports: [],
  templateUrl: './container.html',
  styleUrl: './container.scss',
})
export class Container {
  readonly items = contentChildren(Item, {descendants: true});

  constructor() {
    effect(() => {
      console.log(this.items())
    })
  }
}
