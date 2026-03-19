import { Directive, input } from "@angular/core";

export interface MyForContext<T> {
    readonly $implicit: T;
    readonly index: number;
    readonly first: boolean;
    readonly last: boolean;
    readonly odd: boolean;
    readonly even: boolean;
}

export type MyForTrackBy<T> = (item: T, index: number) => any;


@Directive({
    selector: '[myFor]'
})
export class MyFor<T> {
    readonly myForOf = input.required<T[]>();
    readonly myForTrackBy = input<MyForTrackBy<T>>((item, index) => item);

    static ngTemplateContextGuard<T>(_: MyFor<T>, ctx: unknown): ctx is MyForContext<T> {
        return true;
    }
}