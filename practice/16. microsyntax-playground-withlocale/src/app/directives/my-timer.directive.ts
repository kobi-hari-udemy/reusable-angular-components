import { computed, Directive, effect, inject, input, signal, Signal, TemplateRef, ViewContainerRef } from "@angular/core";

export type TimeState = 'running' | 'done';
export interface MyTimerContext {
    readonly value: Signal<number>;
    readonly state: Signal<TimeState>;
    readonly myTimer: Signal<number>;
    readonly myTimerFrom: Signal<number>;
}

@Directive({
    selector: '[myTimer]'
})
export class MyTimer {
    readonly myTimer = input.required<number>();

    readonly myTimerFrom = input(0);
    readonly myTimerTo = input(Infinity);
    readonly myTimerStep = input(1);

    readonly template = inject<TemplateRef<MyTimerContext>>(TemplateRef);
    readonly vcr = inject(ViewContainerRef);

    private readonly value = signal(0);
    private readonly state = computed<TimeState>(() => 
        this.value() >= this.myTimerTo() ? 'done' : 'running');

    constructor() {
        const ctx: MyTimerContext = {
            value: this.value.asReadonly(), 
            state: this.state, 
            myTimer: this.myTimer, 
            myTimerFrom: this.myTimerFrom
        }
        this.vcr.createEmbeddedView(this.template, ctx);

        effect((onCleanup) => {
            const interval = this.myTimer();
            const from = this.myTimerFrom();
            const to = this.myTimerTo();
            const step = this.myTimerStep();

            this.value.set(from);

            const id = setInterval(() => {
                this.value.update(v => Math.min(v + step, to));
                if (this.value() >= to) {
                    clearInterval(id);
                }
            }, interval);
            onCleanup(() => clearInterval(id));
        })
    }

    static ngTemplateContextGuard(_: MyTimer, ctx: unknown): ctx is MyTimerContext {
        return true;
    }

}