# Practice 9 - Customizable Toggle Button

In this exercise we will make the **toggle button** of the `ExpanderComponent` customizable via content projection. Along the way we will learn how to connect projected content back to the component's logic using a **directive**, handle optional dependency injection, use `contentChild` to detect projected content, and finally turn the directive into a **component** to support state-dependent content inside the button.

The starting project already has multi-slot content projection for the header (`[expander-header]`) and a default slot for the body. The toggle area currently renders a hard-coded `+` / `-` button.

---

## Phase 1 - Project a custom toggle button

### Step 1
In `expander.html`, replace the hard-coded `<button>` inside the `.toggle-area` div with an `<ng-content>` that selects by the attribute `[expander-toggle]`:

```html
<div class="toggle-area">
  <ng-content select="[expander-toggle]" />
</div>
```

### Step 2
In `app.html`, add a custom button with the `expander-toggle` attribute inside each `<app-expander>`:

```html
<app-expander>
  <span expander-header>...</span>
  <button expander-toggle>Toggle</button>
  <!-- ...body content... -->
</app-expander>
```

### Step 3
Run the application. The custom button appears in the toggle area - but **clicking it does nothing**. The `(click)="toggle()"` binding was on the old hard-coded button, and we **cannot place event bindings on `<ng-content>`** since it is not a real DOM element. We need another way to connect the projected button to the expander's `toggle()` method.

---

## Phase 2 - Create an `expander-toggle` directive

### Step 4
Create a new directive file, e.g. `components/expander/expander-toggle/expander-toggle.ts`. The directive's selector should be `[expander-toggle]` - the **same attribute** used for content projection. This way, any element marked with `expander-toggle` is both projected into the toggle slot **and** picked up by the directive automatically.

```typescript
@Directive({
  selector: '[expander-toggle]',
  host: {
    '(click)': 'onClick()',
  },
})
export class ExpanderToggle {
  private expander = inject(ExpanderComponent);

  onClick() {
    this.expander.toggle();
  }
}
```

The directive uses **dependency injection** to get a reference to the parent `ExpanderComponent` and calls `toggle()` on click.

### Step 5
Import `ExpanderToggle` in the `AppComponent` (or wherever the `<button expander-toggle>` elements are used) so that Angular recognizes the directive.

### Step 6
Verify that clicking the custom buttons now correctly toggles the expanders.

---

## Phase 3 - Package related pieces together

### Step 7
The consumer now needs to import both `ExpanderComponent` and `ExpanderToggle` separately. As a component library grows, this becomes tedious and error-prone - consumers have to know about every internal piece.

A simple and effective pattern is to **export an array** that bundles the component and its related directives together. Create (or update) an `index.ts` barrel file in the `components/expander/` folder:

```typescript
export const Expander = [ExpanderComponent, ExpanderToggleComponent];
```

### Step 8
In `app.ts`, replace the individual imports with the single array:

```typescript
imports: [Expander, Icon],
```

Since Angular's `imports` array is flattened, passing a nested array works seamlessly - each item in the array is registered as if it were listed individually.

### Step 9
Verify the application still works exactly as before. This is a purely organizational change - no behavior should differ.

---

## Phase 4 - Make the injection optional

### Step 10
If someone places `expander-toggle` on a button **outside** an `<app-expander>`, Angular will throw an injection error because there is no `ExpanderComponent` in the injector chain.

To prevent this, make the injection **optional**:

```typescript
private expander = inject(ExpanderComponent, { optional: true });
```

Then guard the `onClick` method:

```typescript
onClick() {
  this.expander?.toggle();
}
```

This makes the directive safe to use anywhere - it simply does nothing when there is no parent expander.

---

## Phase 5 - Chevron icon with rotation

### Step 11
Now that we have a working custom toggle button, let's make it visually appealing. Use a **template reference variable** on `<app-expander>` to access the component's state and conditionally style the button.

In `app.html`, update the expander to use a template reference and a chevron icon:

```html
<app-expander #ex>
  <span expander-header>...</span>
  <button expander-toggle>
    <app-icon name="chevron" [class.expanded]="ex.isExpanded()"/>
  </button>
  <!-- ...body content... -->
</app-expander>
```

### Step 12
Add CSS (in `app.scss` or inline styles) so that the `app-icon` smoothly rotates its chevron icon when the expander is expanded. For example:

```scss
app-icon {
  transition: rotate 300ms;
  
  &.expanded {
    rotate: 180deg;
  }
}
```

---

## Phase 6 - State-dependent content inside the toggle

### Step 13
We now want the consumer to be able to provide **different content** for the expanded and collapsed states inside the custom toggle button:

```html
<button expander-toggle class="text-button">
  <span expander-open>Less</span>
  <span expander-closed>More</span>
</button>
```

To achieve this, convert `ExpanderToggle` from a **directive** to a **component**. As a component, it can have its own template that controls what gets rendered.

### Step 14
Update the `ExpanderToggle` to be a component with a template that uses multi-slot `<ng-content>` to display content conditionally:

```typescript
@Component({
  selector: '[expander-toggle]',
  host: {
    '(click)': 'onClick()',
  },
  template: `
    @if (isExpanded()) {
      <ng-content select="[expander-open]" />
    } 

    @if (isCollapsed()) {
      <ng-content select="[expander-closed]" />
    } 

    <ng-content/>
  `,
})
export class ExpanderToggle {
  private readonly expanderComponent = inject(ExpanderComponent, { optional: true });

  readonly isCollapsed = computed(() => this.expanderComponent?.isExpanded() === false);
  readonly isExpanded = computed(() => this.expanderComponent?.isExpanded() === true);

  onClick() {
    this.expanderComponent?.toggle();
  }
}
```

A few things to note:
- The `expanderComponent` property is `private` - only the computed signals are exposed to the template.
- `isExpanded` and `isCollapsed` are both `false` when there is no parent expander (since `undefined === true` and `undefined === false` are both `false`). This ensures the component degrades gracefully.
- The template has a **default `<ng-content />`** slot in addition to the two conditional slots. This means the consumer can also place content that is visible in **both** states (e.g., an icon that is always shown alongside the state-dependent text).

### Step 15
In `app.html`, update the custom toggle buttons to use `expander-open` and `expander-closed` markers:

```html
<button expander-toggle class="text-button">
  <span expander-open>Less</span>
  <span expander-closed>More</span>
</button>
```

### Step 16
Verify that the button text switches between "More" and "Less" depending on the expander state.

---

## Phase 7 - Fallback to a default toggle button

### Step 17
Now if a consumer does **not** provide a custom `expander-toggle` button, the toggle area will be empty - there will be no button at all.

To fix this, detect whether a custom toggle was projected using `contentChild`, and if not, render a **default** button.

In `expander.ts`, add a content child query for the `ExpanderToggle` directive, and a computed signal that indicates whether a custom toggle was found:

```typescript
readonly toggleDirective = contentChild(ExpanderToggle);
readonly hasToggle = computed(() => !!this.toggleDirective());
```

### Step 18
In `expander.html`, wrap the default button and the `<ng-content>` in a conditional block:

```html
<div class="toggle-area">
  @if (hasToggle()) {
    <ng-content select="[expander-toggle]" />
  } @else {
    <button (click)="toggle()">
      @if (isExpanded()) { - } @else { + }
    </button>
  }
</div>
```

Make sure to import `ExpanderToggle` in the `ExpanderComponent`.

### Step 19
Verify that expanders **with** a custom toggle button use the projected content, while expanders **without** one fall back to the default `+` / `-` button.

---

## Phase 8 - Directive Composition Pattern

### Step 20

Take a moment to reflect on what we've built. This practice demonstrates the **Directive Composition** pattern:

- A **custom attribute** (`expander-toggle`) serves double duty: it acts as an `<ng-content select>` target for projection **and** as the selector for a directive/component that wires up behavior.
- The directive uses **dependency injection** to reach its parent component, keeping the coupling implicit and clean.
- By upgrading the directive to a component, we gained **template control** over the projected content, enabling state-dependent rendering.

This is a powerful technique for building reusable component libraries - consumers simply drop an attribute on their own elements to opt into both slot placement and behavior, without needing to know the internal wiring.
