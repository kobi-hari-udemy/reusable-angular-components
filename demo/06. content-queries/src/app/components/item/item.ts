import { Component, input } from '@angular/core';

@Component({
  selector: 'app-item',
  imports: [],
  templateUrl: './item.html',
  styleUrl: './item.scss',
})
export class Item {
  readonly uid = input.required<string>();

}
