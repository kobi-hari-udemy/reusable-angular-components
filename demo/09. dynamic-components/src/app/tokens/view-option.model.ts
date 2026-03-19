import { InjectionToken, InputSignal, Type } from '@angular/core';
import { Product } from '../models/product.model';

export interface ViewComponent {
  readonly items: InputSignal<Product[]>;
}

export interface ViewOption {
  readonly label: string;
  readonly value: string;
  readonly component: Type<ViewComponent>;
}

export const VIEW_OPTIONS = new InjectionToken<ViewOption[]>('VIEW_OPTIONS');
