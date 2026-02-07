import { computed, Directive, ElementRef, inject, Renderer2, signal } from "@angular/core";

@Directive({
    selector: '[highlight]', 
    host: {
        '[style.background-color]': 'bg()',         
        '[attr.title]': 'bg()', 
        '[attr.contenteditable]': 'true', 
        '[class.highlighted]': 'isHighlighted()', 
        '[class.was-highligted]': '!isHighlighted()', 
        '[class]': 'bgClass()'
    }
})
export class HighlightDirective {
    readonly bg = signal('lime');
    readonly isHighlighted = signal(true);

    readonly bgClass = computed(() => 
        `${this.bg()}-highlight`);

    constructor() {
        setTimeout(() => {
            this.bg.set('pink');
            this.isHighlighted.set(false);
        }, 5000);
    }

}