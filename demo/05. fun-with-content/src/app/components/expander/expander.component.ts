import { Component, computed, contentChild, input, signal } from '@angular/core';
import { ExpanderToggleComponent } from './expander-toggle/expander-toggle.component';

@Component({
  selector: 'app-expander',
  imports: [],
  templateUrl: './expander.component.html',
  styleUrl: './expander.component.scss',
  host: {
    '[class.collapsed]': 'isCollapsed()', 
    '[class.expanded]': 'isExpanded()'
  }
})
export class ExpanderComponent {

  readonly #isExpanded = signal(false);

  readonly isExpanded = this.#isExpanded.asReadonly();
  readonly isCollapsed = computed(() => !this.isExpanded());

  readonly expanderToggleComponent = contentChild(ExpanderToggleComponent);
  readonly hasCustomToggle = computed(() => !!this.expanderToggleComponent());

  toggle() {
    this.#isExpanded.update(v => !v);
  }
}
