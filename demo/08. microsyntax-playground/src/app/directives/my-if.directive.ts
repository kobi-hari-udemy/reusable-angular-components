import { Directive, input } from "@angular/core";

export interface MyIfContext {
    readonly myIf: any;
}

@Directive({
    selector: '[myIf]'
})
export class MyIf {
    readonly myIf = input.required<any>();

    static ngTemplateContextGuard(_: MyIf, ctx: unknown): ctx is MyIfContext {
        return true;
    }

}