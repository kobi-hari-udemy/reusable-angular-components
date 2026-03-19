import { Component, inject, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { VIEW_ACTIONS } from '../../tokens/view-actions.token';

@Component({
  selector: 'app-cards-view',
  imports: [CurrencyPipe],
  templateUrl: './cards-view.html',
  styleUrl: './cards-view.scss',
})
export class CardsViewComponent {
  readonly items = input.required<Product[]>();
  readonly viewActions = inject(VIEW_ACTIONS, {optional: true});

  readonly selection = output<Product>();


  onItemClick(product: Product) {
    this.selection.emit(product);
    this.viewActions?.onItemSelect(product);
  }
}
