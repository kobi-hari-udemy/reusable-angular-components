import { Directive, inject, Inject, input, TemplateRef, ViewContainerRef } from "@angular/core";

export interface MyIfContext<T> {
    readonly myIf: T;
}

@Directive({
    selector: '[myIf]'
})
export class MyIf<T> {
    readonly template = inject<TemplateRef<MyIfContext<T>>>(TemplateRef);
    readonly vcr = inject(ViewContainerRef);

    readonly myIf = input.required<T>();

    static ngTemplateContextGuard<T>(_: MyIf<T>, ctx: unknown): ctx is MyIfContext<T> {
        return true;
    }

    constructor() {
        this.vcr.createEmbeddedView(this.template);
    }

}
