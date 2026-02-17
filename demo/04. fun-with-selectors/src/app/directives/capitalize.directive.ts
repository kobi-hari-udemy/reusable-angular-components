import { Directive, inject, Renderer2 } from "@angular/core";
import { capitalizeWords } from "../utils/string.utils";

@Directive({
    selector: 'input[type="text"][capitals]', 
    host: {
        '[style.border]': '"1px solid var(--color-secondary)"', 
        '(blur)': 'capitalize($event)'
    }


})
export class Capitalize {
    readonly renderer = inject(Renderer2);

    capitalize(event: FocusEvent) {
        const input = event.target as HTMLInputElement;
        const value = input.value;
        const fixedValue = capitalizeWords(value);
        this.renderer.setProperty(input, 'value', fixedValue);


    }

}