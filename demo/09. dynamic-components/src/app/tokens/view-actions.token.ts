import { InjectionToken } from '@angular/core';
import { Product } from '../models/product.model';

export type ItemSelectFn = (product: Product) => void;

export interface ViewActions {
  readonly onItemSelect: ItemSelectFn;
}

export const VIEW_ACTIONS = new InjectionToken<ViewActions>('VIEW_ACTIONS');
