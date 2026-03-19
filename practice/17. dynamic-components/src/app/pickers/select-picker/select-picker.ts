import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectOption } from '../../models/select-option.model';

@Component({
  selector: 'app-select-picker',
  imports: [FormsModule],
  templateUrl: './select-picker.html',
  styleUrl: './select-picker.scss',
})
export class SelectPickerComponent {
  readonly options = input.required<SelectOption[]>();
  readonly value = model.required<string>();
}
