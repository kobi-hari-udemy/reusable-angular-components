import { Directive } from "@angular/core";

@Directive({
    selector: '[highlight]'
})
export class HighlightDirective {
    constructor() {
        console.log('Highlight Directive was created');
    }

}