import { Directive, ElementRef, inject, Renderer2, signal } from "@angular/core";

@Directive({
    selector: '[highlight]', 
    host: {
        '[style.background-color]': 'bg()', 
        '[style.border]': '"0px solid blue"', 
        '[style.border-bottom-width.px]': 'thickness()', 
        '[style.--my-property.pt]': 'thickness()'
    }
})
export class HighlightDirective {
    readonly bg = signal('lime');

    readonly thickness = signal(3);

    constructor() {
        setTimeout(() => {
            this.bg.set('pink')
        }, 5000);
    }

}