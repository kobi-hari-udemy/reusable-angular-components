import { Component } from "@angular/core";

@Component({
    selector: 'button',
    host: {
        '[style.border]': '"1px solid var(--color-secondary)"'
    },
    template: `
     !! <ng-content/> !!
    `
})
export class CrazyButton {}