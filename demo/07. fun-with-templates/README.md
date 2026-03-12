# Practice 11 - Fun with Templates

In this exercise we will create a reusable `ItemSelector` component, then progressively make it customizable using **`ng-template`**, **`TemplateRef`**, and a **content child directive**. Along the way we will learn how to pass templates into the component, define typed template contexts, use `ngTemplateOutlet`, and detect projected templates via `contentChild`. We will also slowly improve the syntax and ergonomics of using custom templates, culminating in a clean and intuitive API.

The starting project is a simple text-editor styling tool. It presents three selector panels (Color, Font, Size) - each rendered with an identical `@for` block - and a `<textarea>` that reflects the selected styles. The three selector blocks are copy-pasted, which is the duplication we will fix.

---

## Phase 1 - Create a reusable `ItemSelector` component

### Step 1
Create a new component at `app/components/item-selector/`. The component should have the selector `app-item-selector` and use SCSS for styles.

The component should have:
- A **required string input** called `title` - the label displayed above the options.
- A **required string array input** called `options` - the list of options to display.
- A **model signal** called `selectedOption` (defaulting to `''`) - this provides two-way binding with the parent via `[(selectedOption)]`.
- A `select(option)` method that sets `selectedOption` to the clicked option.

### Step 2
The component template:

```html
<span>{{title()}}</span>
<div class="options-list">
  @for (option of options(); track option) {
    <div
      class="option-item"
      [class.is-selected]="selectedOption() === option"
      (click)="select(option)"
    >
      {{ option }}
    </div>
  }
</div>
```

### Step 3
Move the relevant styles from `app.scss` into `item-selector.scss`. The `.item-selector` wrapper styles (`.options-list`, `.option-item`, `.is-selected`) belong in the new component. Use a `:host` selector to style the component container itself:

The `.options-list` and `.option-item` rules move as-is from `app.scss`.

### Step 4
In `app.ts`, import the new `ItemSelector` component and add it to the `imports` array.

### Step 5
In `app.html`, replace the three duplicated selector blocks with `<app-item-selector>` instances:

```html
<div class="colors-area">
  <app-item-selector
    title="Color"
    [options]="possibleColors()"
    [(selectedOption)]="selectedColor"
  />
</div>

<div class="fonts-area">
  <app-item-selector
    title="Font"
    [options]="possibleFonts()"
    [(selectedOption)]="selectedFont"
  />
</div>

<div class="sizes-area">
  <app-item-selector
    title="Size"
    [options]="possibleSizes()"
    [(selectedOption)]="selectedSize"
  />
</div>
```

Notice that with two-way binding on the model signal, we no longer need the `onColorChange`, `onFontChange`, and `onSizeChange` methods in `AppComponent` - the model writes directly to the signal.

### Step 6
Clean up `app.ts` by removing the three `onChange` methods that are no longer needed.

### Step 7
Verify the application: all three selectors should work as before - selecting an option updates the textarea styling. The template is now much cleaner, but there is a **problem**: every option chip renders as plain text. What if we want to display color names **in their actual color**, font names **in their actual font**, and sizes **in their actual size**? The component currently gives us no way to customize how individual options are rendered.

---

## Phase 2 - Accept a custom template via `TemplateRef` input

### Step 8
In `item-selector.ts`, add an optional input that accepts a `TemplateRef`:

```typescript
readonly itemTemplate = input<TemplateRef<any>>();
```

Import `TemplateRef` from `@angular/core`.

### Step 9
In `item-selector.html`, conditionally use the custom template when one is provided. Import `CommonModule` (for `ngTemplateOutlet`) in the component's `imports` array, then update the template:

```html
@for (option of options(); track option) {
  <div
    class="option-item"
    [class.is-selected]="selectedOption() === option"
    (click)="select(option)"
  >
    @if (itemTemplate()) {
      <ng-container
        *ngTemplateOutlet="itemTemplate()!; context: { $implicit: option }"
      />
    } @else {
      {{ option }}
    }
  </div>
}
```

When a custom `itemTemplate` is supplied, we stamp it out using `ngTemplateOutlet` and pass the current option string as the **implicit context** (`$implicit`). When no template is supplied, we fall back to plain text.

### Step 10
In `app.html`, define an `<ng-template>` for the color selector that shows each color name **in its own color**, and pass it to the component via the `itemTemplate` input:

```html
<ng-template #colorTemplate let-color>
  <span [style.color]="color">{{ color }}</span>
</ng-template>

<div class="colors-area">
  <app-item-selector
    title="Color"
    [options]="possibleColors()"
    [(selectedOption)]="selectedColor"
    [itemTemplate]="colorTemplate"
  />
</div>
```

The `let-color` declaration captures the `$implicit` context value - the option string.

### Step 11
Verify that the color selector now displays each color name in its own color, while the font and size selectors still render plain text (no template provided).

### Step 12
Optionally, create similar templates for fonts and sizes:

```html
<ng-template #fontTemplate let-font>
  <span [style.font-family]="font">{{ font }}</span>
</ng-template>

<ng-template #sizeTemplate let-size>
  <span [style.font-size]="size">{{ size }}</span>
</ng-template>
```

Pass them to the respective `<app-item-selector>` instances and verify the result.

### Step 13
Take a moment to observe the ergonomics. The approach works, but it is **cumbersome**: each custom template must be defined as a separate `<ng-template>` somewhere in the parent template, given a template reference variable, and then passed as a property binding. The template definition and its usage are physically separated, making the markup harder to read - especially as the number of selectors grows.

---

## Phase 3 - Accept the template as projected content via a directive

### Step 14
Create a new directive at `app/components/item-selector/item-template.directive.ts`:

```typescript
import { Directive, inject, TemplateRef } from "@angular/core";

type ItemTemplateContext = {
  readonly $implicit: string;
}

@Directive({
  selector: '[app-item-template]'
})
export class ItemTemplateDirective {
  readonly template = inject<TemplateRef<ItemTemplateContext>>(TemplateRef);
}
```

A few things to note:
- The directive is designed to be placed on an `<ng-template>` element. When Angular sees a directive on `<ng-template>`, it makes the `TemplateRef` available for injection.
- The `ItemTemplateContext` type constrains what context variables the template can use - just a single implicit `string`. This gives consumers **strong typing** on `let-` variables.

### Step 15
In `item-selector.ts`, remove the old `itemTemplate` **input** and replace it with a content-child-based approach:

- Use `contentChild` to find an `ItemTemplateDirective` among the component's projected content.
- Create a **computed signal** called `hasItemTemplate` that returns `true` when the directive is present.
- Create a **computed signal** called `itemTemplate` that extracts the `TemplateRef` from the directive (or `null` if none is projected).

The template detection is now automatic - no property binding needed from the consumer side.

### Step 16
Update `item-selector.html` to use the content-child-based template:

```html
@for (option of options(); track option) {
  <div
    class="option-item"
    [class.is-selected]="selectedOption() === option"
    (click)="select(option)"
  >
    @if (hasItemTemplate()) {
      <ng-container
        *ngTemplateOutlet="itemTemplate(); context: { $implicit: option }"
      />
    } @else {
      {{ option }}
    }
  </div>
}
```

### Step 17
Export the component and directive together as an array so consumers only need a single import:

```typescript
export const ItemSelector = [ItemSelectorComponent, ItemTemplateDirective];
```

### Step 18
In `app.ts`, update the import to use the bundled `ItemSelector` array.

### Step 19
In `app.html`, replace the separated `<ng-template>` + input binding pattern with inline projected templates. The custom template is now placed **inside** the component as a child:

```html
<div class="colors-area">
  <app-item-selector
    title="Color"
    [options]="possibleColors()"
    [(selectedOption)]="selectedColor"
  >
    <ng-template app-item-template let-color>
      <span [style.color]="color">{{ color }}</span>
    </ng-template>
  </app-item-selector>
</div>
```

The `app-item-template` attribute on `<ng-template>` activates the directive, which the component detects via `contentChild`. No template reference variable, no property binding - the template lives right where it is consumed.

### Step 20
Apply the same pattern to the font and size selectors:

```html
<div class="fonts-area">
  <app-item-selector
    title="Font"
    [options]="possibleFonts()"
    [(selectedOption)]="selectedFont"
  >
    <ng-template app-item-template let-font>
      <span [style.font-family]="font">{{ font }}</span>
    </ng-template>
  </app-item-selector>
</div>

<div class="sizes-area">
  <app-item-selector
    title="Size"
    [options]="possibleSizes()"
    [(selectedOption)]="selectedSize"
  >
    <ng-template app-item-template let-size>
      <span [style.font-size]="size">{{ size }}</span>
    </ng-template>
  </app-item-selector>
</div>
```

### Step 21
Verify the application: all three selectors should render their options with custom styling - colors in their color, fonts in their font, sizes in their size - and selection should still work correctly. The template code is now clean, co-located, and strongly typed.

---

## Phase 4 - Use the star directive syntax

### Background
Angular provides a shorthand known as the **star syntax** (`*directive`) for directives placed on `<ng-template>`. When you write:

```html
<span *appItemTemplate="let color">{{ color }}</span>
```

Angular **desugars** it into:

```html
<ng-template appItemTemplate let-color>
  <span>{{ color }}</span>
</ng-template>
```

The star tells Angular to wrap the host element in an `<ng-template>` and move the directive onto it. This is the same mechanism used by built-in structural directives like `*ngIf` and `*ngFor`. Any directive that injects `TemplateRef` can be used with this syntax.

The benefit is purely ergonomic - one less level of nesting and no explicit `<ng-template>` tag.

### Step 22
In `app.html`, replace the explicit `<ng-template app-item-template let-...>` wrappers with the star syntax. For example, the color selector becomes:

```html
<div class="colors-area">
  <app-item-selector
    title="Color"
    [options]="possibleColors()"
    [(selectedOption)]="selectedColor"
  >
    <span *appItemTemplate="let color" [style.color]="color">{{ color }}</span>
  </app-item-selector>
</div>
```

Apply the same transformation to the font and size selectors.

Note that the star syntax requires the directive selector to be in **camelCase** (e.g. `*appItemTemplate`), not kebab-case. Update the directive's selector from `[app-item-template]` to `[appItemTemplate]` to match.

### Step 23
Verify the application still works exactly as before - this is a purely syntactic change with no behavioral difference.

---

## Phase 5 - Customizable option container via a second template directive

The `ItemSelector` currently lets consumers customize the **content** of each option chip (via `appItemTemplate`), but the chip container itself - including its selected/unselected styling and click behavior - is hard-coded inside the component. What if a consumer wants to completely change how selection looks? For example, using checkboxes, radio buttons, or a totally different visual treatment for the selected state.

To support this, we will introduce a second template directive called `app-item-container` that lets the consumer take full control of the **entire option element**, not just its inner content.

### Step 24
Create a new directive at `app/components/item-selector/item-container.directive.ts` with the selector `[app-item-container]`.

The directive should:
- Inject a `TemplateRef` just like `ItemTemplateDirective` does.
- Define a **context type** that is richer than `ItemTemplateContext`. The context should provide three things to the consumer's template:
  - The option string (as `$implicit`).
  - A boolean indicating whether this option is currently selected (`isSelected`).
  - A callback function that the consumer can call to select this option (`onSelect`).

### Step 25
In `item-selector.ts`, detect the new directive via `contentChild` - the same pattern used for `ItemTemplateDirective`. Add `hasItemContainer` and `itemContainer` computed signals that mirror the existing `hasItemTemplate` / `itemTemplate` pair.

### Step 26
Update `item-selector.html` to support the new container template. The rendering logic should now have **three tiers** of customization, checked in this order:

1. If an **item container** template is projected, use it for the entire option - stamp it out via `ngTemplateOutlet` with a context object containing the option string, the `isSelected` boolean, and a callback that calls `select(option)`.
2. Otherwise, render the default `.option-item` div (with built-in selected styling and click handling), and inside it:
   - If an **item template** is projected, use it for the inner content.
   - Otherwise, render the option as plain text.

### Step 27
Add `ItemContainerDirective` to the exported `ItemSelector` array so consumers get it automatically.

### Step 28
In `app.html`, try out the new directive on one of the selectors. For example, in the color selector, provide an `app-item-container` template that renders each option using your own custom markup. Use the `let-` syntax to capture the context variables: the option value (implicit), `isSelected`, and `onSelect`. Wire `onSelect` to a click handler and use `isSelected` to conditionally apply your own styling or CSS classes.

### Step 29
Verify the application: the selector with the custom container should render with your custom look and feel, while the other selectors continue to use the default chip styling. Selection should still work correctly across all selectors.

---

## Phase 6 - Add type safety with `ngTemplateContextGuard`

### Step 30
Hover over one of the `let-` variables in `app.html` - for example, `let-color` on an `*appItemTemplate` usage, or `let-isSelected` on an `*appItemContainer` usage. Notice that the IDE's IntelliSense reports the type as **`any`**. This means there is no compile-time checking on what you do with these variables - you could misspell a property or use them incorrectly and get no warning.

### Step 31
Angular determines the type of template context variables using a special static method called **`ngTemplateContextGuard`**. When a directive defines this method, Angular's template type checker uses it to narrow the context type, giving `let-` bindings their correct types.

The method signature is:

```typescript
static ngTemplateContextGuard(dir: MyDirective, ctx: unknown): ctx is MyContextType {
  return true;
}
```

- The first parameter is the directive instance type.
- The second parameter is the unknown context.
- The return type is a **type predicate** (`ctx is MyContextType`) that tells the compiler what the context actually is.
- The body simply returns `true` - the narrowing happens at the type level, not at runtime.

### Step 32
Add `ngTemplateContextGuard` to `ItemTemplateDirective`:

```typescript
static ngTemplateContextGuard(dir: ItemTemplateDirective, ctx: unknown): ctx is ItemTemplateContext {
  return true;
}
```

### Step 33
Add `ngTemplateContextGuard` to `ItemContainerDirective`:

```typescript
static ngTemplateContextGuard(dir: ItemContainerDirective, ctx: unknown): ctx is ItemContainerContext {
  return true;
}
```

### Step 34
Go back to `app.html` and hover over the `let-` variables again. The IDE should now report the correct types - `string` for `let-color` on `appItemTemplate`, and `string`, `boolean`, `() => void` for the context variables on `appItemContainer`. Template expressions using these variables are now fully type-checked.
