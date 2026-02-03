import { Directive, ElementRef, inject, Renderer2, signal } from "@angular/core";

@Directive({
    selector: '[highlight]', 
    host: {
        '[style.background-color]': 'bg()'
    }
})
export class HighlightDirective {
    readonly bg = signal('lime');
    constructor() {
        setTimeout(() => {
            this.bg.set('pink')
        }, 5000);
    }

}