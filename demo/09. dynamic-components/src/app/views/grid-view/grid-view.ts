import { Component, inject, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { VIEW_ACTIONS } from '../../tokens/view-actions.token';

@Component({
  selector: 'app-grid-view',
  imports: [CurrencyPipe],
  templateUrl: './grid-view.html',
  styleUrl: './grid-view.scss',
})
export class GridViewComponent {
  readonly items = input.required<Product[]>();
  readonly selection = output<Product>();

  onItemClick(product: Product) {
    this.selection.emit(product);
  }
}
