import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-item-selector',
  imports: [],
  templateUrl: './item-selector.html',
  styleUrl: './item-selector.scss',
})
export class ItemSelectorComponent {
  readonly title = input.required<string>();
  readonly options = input.required<string[]>();
  readonly selectedOption = model('');

  select(option: string) {
    this.selectedOption.set(option);
  }

}
