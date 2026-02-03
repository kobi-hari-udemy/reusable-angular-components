import { Directive, ElementRef, inject } from "@angular/core";

@Directive({
    selector: '[highlight]'
})
export class HighlightDirective {
    readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);

    constructor() {
        console.log('Highlight Directive was created');
        this.hostElement.nativeElement.style.backgroundColor = 'yellow';
    }

}