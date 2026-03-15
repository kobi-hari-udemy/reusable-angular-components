import { Directive, input } from "@angular/core";

@Directive({
    selector: '[myRepeat]'
})
export class MyRepeat {
    readonly myRepeat = input.required<number>();

    readonly myRepeatStart = input(0);

    readonly myRepeatSkip = input(1);

}