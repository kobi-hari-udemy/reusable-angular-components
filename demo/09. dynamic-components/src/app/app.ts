import {
  Component,
  computed,
  inject,
  Injector,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from './models/product.model';
import { PRODUCTS } from './data/products.data';
import { VIEW_OPTIONS } from './tokens/view-option.model';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { SelectOption } from './models/select-option.model';
import { SelectPickerComponent } from "./pickers/select-picker/select-picker";
import { GridViewComponent } from './views/grid-view/grid-view';
import { VIEW_ACTIONS, ViewActions } from './tokens/view-actions.token';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ProductDetailComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly injector = inject(Injector);
  readonly pickerVcr = viewChild.required('pickerAnchor', { read: ViewContainerRef });

  private readonly viewOptions = inject(VIEW_OPTIONS);
  readonly views = computed<SelectOption[]>(() => this.viewOptions.map(o => ({
    label: o.label, 
    value: o.value
  })));

  readonly selectedView = signal<string>('grid');

  readonly activeViewComponent = computed(() => {
    const found = this.viewOptions.find(v => v.value === this.selectedView());
    return found?.component ?? GridViewComponent
  });

  readonly activeViewInputs = computed(() => ({
    items: this.products()
  }));

  readonly viewActions: ViewActions = {
    onItemSelect: (product) => this.selectedProduct.set(product)
  }

    readonly viewInjector = Injector.create({
    parent: this.injector,
    providers: [
      {provide: VIEW_ACTIONS, useValue: this.viewActions}
    ]
  })

  

  readonly products = signal(PRODUCTS);
  readonly selectedProduct = signal<Product | null>(null);

  constructor() {
  }
}

