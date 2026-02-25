import { Component, computed, Directive, inject } from "@angular/core";
import { ExpanderComponent } from "../expander.component";

@Component({
    selector: '[expander-toggle]', 
    templateUrl: './expander-toggle.component.html', 
    styleUrl: './expander-toggle.component.scss',
    host: {
        '(click)': 'onClick()'
    }
})
export class ExpanderToggleComponent {

    readonly expanderComponent = inject(ExpanderComponent, {
        optional: true
    });

    readonly isExpanded = computed(() => this.expanderComponent?.isExpanded() === true);
    readonly isCollapsed = computed(() => this.expanderComponent?.isExpanded() === false);

    
    onClick() {
        this.expanderComponent?.toggle();
    }

}