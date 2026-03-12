import { CommonModule } from '@angular/common';
import { Component, computed, contentChild, input, model, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-item-selector',
  imports: [CommonModule],
  templateUrl: './item-selector.html',
  styleUrl: './item-selector.scss',
})
export class ItemSelectorComponent {
  readonly title = input.required<string>();
  readonly options = input.required<string[]>();
  readonly selectedOption = model('');

  readonly itemTemplate = contentChild<TemplateRef<any>>(TemplateRef);
  readonly hasItemTemplate = computed(() => !!this.itemTemplate());

  select(option: string) {
    this.selectedOption.set(option);
  }

}
