import { Directive, effect, input } from "@angular/core";

export type TimeState = 'running' | 'done';
export interface MyTimerContext {
    readonly value: number;
    readonly state: TimeState;
}

@Directive({
    selector: '[myTimer]'
})
export class MyTimer {
    readonly myTimer = input.required<number>();

    readonly myTimerFrom = input(0);
    readonly myTimerTo = input(Infinity);
    readonly myTimerStep = input(1);

    constructor() {
        effect(() => {
            console.log(`MyTimer Interval: ${this.myTimer()}
                From: ${this.myTimerFrom()}, 
                To: ${this.myTimerTo()}
                Step: ${this.myTimerStep()}
            `)
        })
    }

    static ngTemplateContextGuard(_: MyTimer, ctx: unknown): ctx is MyTimerContext {
        return true;
    }

}