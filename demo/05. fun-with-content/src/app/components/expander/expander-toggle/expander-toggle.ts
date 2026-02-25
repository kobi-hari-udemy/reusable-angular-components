import { Directive, inject } from "@angular/core";
import { ExpanderComponent } from "../expander";

@Directive({
    selector: '[expander-toggle]', 
    host: {
        '(click)': 'onClick()'
    }
})
export class ExpanderToggleDirective {

    readonly expanderComponent = inject(ExpanderComponent);

    
    onClick() {
        this.expanderComponent.toggle();
    }

}