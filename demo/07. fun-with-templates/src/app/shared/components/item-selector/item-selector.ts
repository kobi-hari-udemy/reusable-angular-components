import { CommonModule } from '@angular/common';
import { Component, computed, contentChild, input, model, TemplateRef } from '@angular/core';
import { ItemTemplateDirective } from './item-template.directive';
import { ItemContainerDirective } from './item-container.directive';

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

  readonly itemTemplateDirective = contentChild(ItemTemplateDirective);
  readonly hasItemTemplate = computed(() => !!this.itemTemplateDirective());
  readonly itemTemplate = computed(() => this.itemTemplateDirective()?.template ?? null);

  readonly itemContainerDirective = contentChild(ItemContainerDirective);
  readonly hasItemContainer = computed(() => !!this.itemContainerDirective());
  readonly itemContainer = computed(() => this.itemContainerDirective()?.template ?? null);

  select(option: string) {
    this.selectedOption.set(option);
  }
}

export const ItemSelector = [ItemSelectorComponent, ItemTemplateDirective, ItemContainerDirective];
