import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from './models/product.model';
import { PRODUCTS } from './data/products.data';
import { VIEW_OPTIONS } from './tokens/view-option.model';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { SelectOption } from './models/select-option.model';
import { SelectPickerComponent } from "./pickers/select-picker/select-picker";
import { ListViewComponent } from './views/list-view/list-view';
import { GridViewComponent } from './views/grid-view/grid-view';

@Component({
  selector: 'app-root',
  imports: [CommonModule, SelectPickerComponent, ListViewComponent, ProductDetailComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly viewOptions = inject(VIEW_OPTIONS);
  readonly views = computed<SelectOption[]>(() => this.viewOptions.map(o => ({
    label: o.label, 
    value: o.value
  })));

  readonly selectedView = signal<string>('grid');

  readonly activeViewComponent = computed(() => {
    const found = this.viewOptions.find(v => v.value === this.selectedView());
    return found?.component ?? GridViewComponent
  })
  

  readonly products = signal(PRODUCTS);
  readonly selectedProduct = signal<Product | null>(null);

  constructor() {
  }
}

