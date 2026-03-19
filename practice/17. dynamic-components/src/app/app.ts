import {
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from './models/product.model';
import { PRODUCTS } from './data/products.data';
import { VIEW_OPTIONS } from './tokens/view-option.model';
import { CardsViewComponent } from "./views/cards-view/cards-view";
import { ProductDetailComponent } from './components/product-detail/product-detail';

@Component({
  selector: 'app-root',
  imports: [CommonModule, CardsViewComponent, ProductDetailComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly viewOptions = inject(VIEW_OPTIONS);

  readonly products = signal(PRODUCTS);
  readonly selectedProduct = signal<Product | null>(null);

  constructor() {
  }
}

