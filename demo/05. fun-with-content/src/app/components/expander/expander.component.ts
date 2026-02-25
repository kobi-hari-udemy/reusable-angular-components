import { Component, computed, signal } from '@angular/core';

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

  toggle() {
    this.#isExpanded.update(v => !v);
  }
}
