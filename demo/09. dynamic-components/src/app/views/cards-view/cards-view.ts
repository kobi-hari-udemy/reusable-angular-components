import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-cards-view',
  imports: [CurrencyPipe],
  templateUrl: './cards-view.html',
  styleUrl: './cards-view.scss',
})
export class CardsViewComponent {
  readonly items = input.required<Product[]>();

  readonly selection = output<Product>();


  onItemClick(product: Product) {
    this.selection.emit(product);
  }
}
