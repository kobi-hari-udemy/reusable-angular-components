import { Directive, ElementRef, inject, TemplateRef } from "@angular/core";

@Directive({
    selector: '[abc]'
})
export class AbcDirective {
    readonly hostElement = inject(ElementRef);

    readonly template = inject(TemplateRef<any>);

    constructor() {
        console.log(this.hostElement);
        console.log(this.template);
    }
}