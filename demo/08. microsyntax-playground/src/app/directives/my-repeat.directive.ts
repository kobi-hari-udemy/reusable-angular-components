import { Directive, effect, inject, input, Signal, TemplateRef, ViewContainerRef } from "@angular/core";

export interface MyRepeatContext {
    readonly $implicit: Signal<number>;
    readonly index: Signal<number>;
    readonly first: Signal<boolean>;
    readonly last: Signal<boolean>;
    readonly myRepeat: Signal<number>;
}

@Directive({
    selector: '[myRepeat]'
})
export class MyRepeat {
    readonly myRepeat = input.required<number>();

    readonly myRepeatStart = input(0);

    readonly myRepeatSkip = input(1);

    readonly vcr = inject(ViewContainerRef);
    readonly template = inject<TemplateRef<MyRepeatContext>>(TemplateRef);

    private invalidate() {
        const count = this.myRepeat();

        while (this.vcr.length > count) {
            this.vcr.remove(this.vcr.length - 1);
        }

        while (this.vcr.length < count) {
            
        }

    }

    constructor() {
        effect(() => {
            this.invalidate();
        })
    }

    static ngTemplateContextGuard(_: MyRepeat, ctx: unknown): ctx is MyRepeatContext {
        return true;
    }
}