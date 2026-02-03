import { Directive, ElementRef, inject, Renderer2 } from "@angular/core";

@Directive({
    selector: '[highlight]'
})
export class HighlightDirective {
    readonly hostElement = inject(ElementRef);
    readonly renderer = inject(Renderer2);

    constructor() {
        console.log('Highlight Directive was created');
        // this.hostElement.nativeElement.style.backgroundColor = 'yellow';

        this.renderer.setStyle(this.hostElement.nativeElement, 
            'background-color', 
            'pink'        
        );
    }

}