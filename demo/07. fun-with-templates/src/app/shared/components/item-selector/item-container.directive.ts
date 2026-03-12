import { Directive, inject, TemplateRef } from '@angular/core';

export interface ItemContainerContext {
  readonly $implicit: string;
  readonly isSelected: boolean;
  readonly onSelect: () => void;
}

@Directive({
  selector: '[appItemContainer]',
})
export class ItemContainerDirective {
  readonly template = inject(TemplateRef<ItemContainerContext>);

  static ngTemplateContextGuard(
    _: ItemContainerDirective,
    ctx: unknown,
  ): ctx is ItemContainerContext {
    return true;
  }
}
