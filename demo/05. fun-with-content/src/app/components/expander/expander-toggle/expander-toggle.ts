import { Directive, inject } from "@angular/core";
import { ExpanderComponent } from "../expander.component";

@Directive({
    selector: '[expander-toggle]', 
    host: {
        '(click)': 'onClick()'
    }
})
export class ExpanderToggleDirective {

    readonly expanderComponent = inject(ExpanderComponent, {
        optional: true
    });

    
    onClick() {
        this.expanderComponent?.toggle();
    }

}