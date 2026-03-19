import { Component, inject, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { VIEW_ACTIONS } from '../../tokens/view-actions.token';

@Component({
  selector: 'app-list-view',
  imports: [CurrencyPipe],
  templateUrl: './list-view.html',
  styleUrl: './list-view.scss',
})
export class ListViewComponent {
  readonly items = input.required<Product[]>();
  readonly selection = output<Product>();

  onItemClick(product: Product) {
    this.selection.emit(product);
  }
}
