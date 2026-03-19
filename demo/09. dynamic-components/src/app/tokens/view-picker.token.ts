import { InjectionToken, InputSignal, ModelSignal, Type } from '@angular/core';
import { SelectOption } from '../models/select-option.model';

export interface ViewPicker {
  readonly options: InputSignal<SelectOption[]>;
  readonly value: ModelSignal<string>;
}

export const VIEW_PICKER = new InjectionToken<Type<ViewPicker>>('VIEW_PICKER');
