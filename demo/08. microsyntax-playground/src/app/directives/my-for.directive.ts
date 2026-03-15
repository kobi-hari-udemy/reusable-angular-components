import { Directive, input } from "@angular/core";

export interface MyForContext {
    readonly $implicit: any;
    readonly index: number;
    readonly first: boolean;
    readonly last: boolean;
    readonly odd: boolean;
    readonly even: boolean;
}

export type MyForTrackBy = (item: any, index: number) => any;


@Directive({
    selector: '[myFor]'
})
export class MyFor {
    readonly myForOf = input.required<any[]>();
    readonly myForTrackBy = input<MyForTrackBy>((item, index) => item);

    static ngTemplateContextGuard(_: MyFor, ctx: unknown): ctx is MyForContext {
        return true;
    }
}