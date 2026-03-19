import { computed, Directive, effect, inject, Inject, input, TemplateRef, ViewContainerRef } from "@angular/core";

type MyIfTruthy<T> = Exclude<T, false | 0 | '' | null | undefined>;

export interface MyIfContext<T> {
    readonly myIf: MyIfTruthy<T>;
}

@Directive({
    selector: '[myIf]'
})
export class MyIf<T> {
    readonly template = inject<TemplateRef<MyIfContext<T>>>(TemplateRef);
    readonly vcr = inject(ViewContainerRef);

    readonly myIf = input.required<T>();
    readonly condition = computed(() => !!this.myIf());

    static ngTemplateContextGuard<T>(_: MyIf<T>, ctx: unknown): ctx is MyIfContext<T> {
        return true;
    }

    private invalidate() {
        const cond = this.condition();
        if (cond) {
            this.vcr.clear();
            const ctx: MyIfContext<T> = {
                myIf: this.myIf() as MyIfTruthy<T>
            }
            this.vcr.createEmbeddedView(this.template, ctx);

        } else {
            if (this.vcr.length > 0) {
                this.vcr.clear();
            }
        }
    }

    constructor() {
        effect(() => {
            this.invalidate();            
        })
    }

}
