import { Directive, input } from "@angular/core";

@Directive({
    selector: 'img[alt][tooltip]', 
    host: {
        '[style.border]': '"2px solid var(--color-accent)"', 
        '[attr.title]': 'alt()'
    }
})
export class ImageAlt {
    readonly alt = input('');
}