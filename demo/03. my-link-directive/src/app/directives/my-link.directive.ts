import { Directive, inject, InjectionToken, Provider } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

export const MY_LINK_ACTIVE_CLASS = new InjectionToken<string>('MY_LINK_ACTIVE_CLASS');
export function provideMyLinkActiveClass(className: string): Provider {
    return {
        provide: MY_LINK_ACTIVE_CLASS, 
        useValue: className
    }
}

@Directive({
    selector: '[myLink]', 
    hostDirectives: [
        {
            directive: RouterLink, 
            inputs: [
                'routerLink: myLink'
            ]

        },
        RouterLinkActive
    ]
})
export class MyLink {
    readonly rla = inject(RouterLinkActive);
    readonly className = inject(MY_LINK_ACTIVE_CLASS, {
        optional: true
    });

    constructor() {
        this.rla.routerLinkActive = this.className || 'selected';
    }

}