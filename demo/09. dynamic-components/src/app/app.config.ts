import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { GridViewComponent } from './views/grid-view/grid-view';
import { ListViewComponent } from './views/list-view/list-view';
import { CardsViewComponent } from './views/cards-view/cards-view';
import { TabPickerComponent } from './pickers/tab-picker/tab-picker';
import { ViewOption, VIEW_OPTIONS } from './tokens/view-option.model';
import { VIEW_PICKER } from './tokens/view-picker.token';
import { SelectPickerComponent } from './pickers/select-picker/select-picker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: VIEW_PICKER, useValue: TabPickerComponent },
    {
      provide: VIEW_OPTIONS,
      useValue: [
        { label: 'Grid', value: 'grid', component: GridViewComponent },
        { label: 'List', value: 'list', component: ListViewComponent },
        { label: 'Cards', value: 'cards', component: CardsViewComponent },
      ] satisfies ViewOption[],
    },
  ],
};
