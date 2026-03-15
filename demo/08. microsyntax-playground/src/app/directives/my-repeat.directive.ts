import { Directive, effect, input } from "@angular/core";

export interface MyRepeatContext {
    readonly $implicit: number;
    readonly index: number;
    readonly first: boolean;
    readonly last: boolean;
}

@Directive({
    selector: '[myRepeat]'
})
export class MyRepeat {
    readonly myRepeat = input.required<number>();

    readonly myRepeatStart = input(0);

    readonly myRepeatSkip = input(1);

    constructor() {
        effect(() => {
            console.log(`My Repeat, times = ${this.myRepeat()}, 
                start = ${this.myRepeatStart()}, 
                skip = ${this.myRepeatSkip()}            
            `)
        })
    }

    static ngTemplateContextGuard(_: MyRepeat, ctx: unknown): ctx is MyRepeatContext {
        return true;
    }
}