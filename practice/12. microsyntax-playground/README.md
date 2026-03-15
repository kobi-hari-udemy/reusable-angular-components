# Practice 12 - Microsyntax Playground

In this exercise we will learn how Angular's **structural directive microsyntax** works by building the input and context API surface for four custom directives: `*myIf`, `*myFor`, `*myRepeat`, and `*myTimer`. We will **not** implement the runtime behavior of these directives - no `ViewContainerRef`, no `TemplateRef` stamping, no DOM manipulation. Instead, we focus entirely on understanding **how the star syntax (`*`) desugars**, how to define **inputs** that the microsyntax populates, how to declare **template context interfaces** that feed `let-` variables, how to upgrade context properties to **signals** for reactivity, how to use the **`as` keyword** via context properties named after the directive selector, how to provide **type safety** via `ngTemplateContextGuard`, and how to support **generic** type guards.

Along the way we will see how our directives mirror the patterns behind Angular's built-in `*ngIf` and `*ngFor`, demystifying the "magic" behind their syntax.

The starting project has four empty directives (`MyIf`, `MyFor`, `MyRepeat`, `MyTimer`) already created and registered in `AppComponent`. Each directive has only a `@Directive` decorator with the correct selector. The `app.html` template has placeholder `*` usages for each one. We will progressively fill in inputs, context interfaces, and type guards until all four directives can be used with their full microsyntax and the IDE reports no errors and correct types.

---

## Background - How the Star Syntax Desugars

When Angular encounters a **star prefix** on an element, it performs a syntactic transformation called **desugaring**. The starred element is wrapped in an `<ng-template>`, and the microsyntax expression is parsed into individual bindings on that template. For example:

```html
<!-- Microsyntax -->
<div *myDirective="expression">...</div>

<!-- Desugared -->
<ng-template [myDirective]="expression">
  <div>...</div>
</ng-template>
```

The key desugaring rules we will learn incrementally across the phases are:

| Microsyntax | Desugared form | Rule |
|---|---|---|
| `*dir="expr"` | `[dir]="expr"` | Primary expression → input with the **same name** as the selector |
| `; key: value` | `[dirKey]="value"` | Key–value pair → input named **`dirKey`** (camelCase concatenation) |
| `let varName` | `let-varName` | Variable bound to the **`$implicit`** context property |
| `let varName = prop` | `let-varName="prop"` | Variable bound to a **named** context property |
| `expr as varName` | `let-varName="dir"` | Variable bound to a context property with the **same name as the input** |

---

## Phase 1 - Populating Inputs

In this phase we learn how the microsyntax maps to directive **inputs**. We will work with `MyRepeat` and `MyTimer` - adding a primary input and secondary inputs to each, and then using the microsyntax in `app.html` to populate them.

### Step 1
Open `directives/my-repeat.directive.ts`. The directive currently has an empty body. Add a **required number input** with the same name as the selector - `myRepeat`:

```typescript
readonly myRepeat = input.required<number>();
```

Import `input` from `@angular/core`.

This is the **primary input**. When someone writes `*myRepeat="5"`, Angular desugars it to `<ng-template [myRepeat]="5">`, which binds directly to this input. The rule is: the first expression in the microsyntax always binds to an input whose name matches the **directive selector**.

### Step 2
The `MyRepeat` directive should also accept `start` and `skip` parameters. In the microsyntax, these are written as **key–value pairs** separated by semicolons:

```
*myRepeat="5; start: 100; skip: -10"
```

Angular desugars each `key: value` pair by **concatenating the directive selector with the key** in camelCase:
- `start: 100` → `[myRepeatStart]="100"`
- `skip: -10` → `[myRepeatSkip]="-10"`

So the full desugared form is:

```html
<ng-template [myRepeat]="5" [myRepeatStart]="100" [myRepeatSkip]="-10">
  ...
</ng-template>
```

Add these two inputs with sensible defaults:

```typescript
readonly myRepeatStart = input(0);
readonly myRepeatSkip = input(1);
```

Since they have defaults, they are optional - consumers can omit them in the microsyntax.

### Step 3
In `app.html`, update the `*myRepeat` usage to pass the primary expression and the key–value pairs:

```html
<div *myRepeat="5; start: 100; skip: -10">
  Repeated
</div>
```

Verify that the IDE shows **no errors**. The microsyntax correctly populates the three inputs.

### Step 4
Now open `directives/my-timer.directive.ts`. Add the **primary input** - a required number representing the timer interval in milliseconds:

```typescript
readonly myTimer = input.required<number>();
```

### Step 5
Add **secondary inputs** for `from`, `to`, and `step`. Following the same `selectorKey` naming rule:
- `from: 10` → `[myTimerFrom]="10"`
- `to: 0` → `[myTimerTo]="0"`
- `step: 1` → `[myTimerStep]="1"`

Add these inputs with appropriate defaults. Think about what reasonable default values would be for a timer that counts upward: a starting value of `0`, an ending value of `Infinity` (no limit), and a step of `1`.

### Step 6
In `app.html`, update the `*myTimer` usage:

```html
<div *myTimer="1000; from: 10; to: 0; step: -1">
  Timer
</div>
```

Verify no errors. The four inputs are populated from the microsyntax.

### Step 7
To confirm that the inputs are actually being populated with the values from the microsyntax, add a constructor with an `effect` to each directive that logs the input values to the console.

You should see output like:

```
MyRepeat: 5 Start: 100 Skip: -10
MyTimer: 1000 From: 10 To: 0 Step: 1
```

This confirms that the microsyntax has correctly desugared into input bindings and the directive receives the expected values. You may remove these effects after verifying, or keep them for reference throughout the exercise.

### Step 8
Take note of the pattern we have established:
- The **primary expression** (the first value after `=`) always maps to an input named after the **directive selector**.
- **Key–value pairs** (`; key: value`) map to inputs named **`selectorKey`** (camelCase concatenation of the selector and the key).
- Inputs with **default values** are optional in the microsyntax.

At this point both directives have inputs only - no template variables or context. The consumer can pass data **into** the directive, but the directive cannot expose any data **back** to the template.

---

## Phase 2 - Defining Template Variables

In this phase we add **template context interfaces** to `MyRepeat` and `MyTimer` so that the microsyntax can define **template variables** using the `let` keyword. We will learn how both **named exports** and the special **`$implicit`** property work. For now we will use simple plain values in the context - we will upgrade to signals in Phase 3.

### Step 9
When a structural directive creates an embedded view, it can pass a **context object**. The properties of this context object become available to the consumer via `let-` variable declarations in the microsyntax. There are two ways to bind template variables to context properties:

1. **Named binding**: `let varName = exportedProp` - binds the variable to a specific named property on the context.
2. **Implicit binding**: `let varName` (with no `= ...`) - binds the variable to the special `$implicit` property on the context.

### Step 10
Let's start with **named bindings** on `MyRepeat`. Define a context interface above the directive class:

```typescript
export interface MyRepeatContext {
  readonly index: number;
  readonly first: boolean;
  readonly last: boolean;
}
```

Each property in the interface is an "exported" value. The consumer will use `let varName = propertyName` to capture them.

### Step 11
In `app.html`, update the `*myRepeat` usage to declare template variables using the named binding syntax:

```html
<div *myRepeat="5; start: 100; skip: -10; let i = index; let isFirst = first; let isLast = last">
  Index: {{ i }}, First: {{ isFirst }}, Last: {{ isLast }}
</div>
```

Each `let var = prop` in the microsyntax desugars to a `let-var="prop"` attribute on the `<ng-template>`:

```html
<ng-template [myRepeat]="5" [myRepeatStart]="100" [myRepeatSkip]="-10"
             let-i="index" let-isFirst="first" let-isLast="last">
  <div>Index: {{ i }}, First: {{ isFirst }}, Last: {{ isLast }}</div>
</ng-template>
```

Angular then looks up `index`, `first`, and `last` on the template context object and assigns their values to `i`, `isFirst`, and `isLast`.

### Step 12
Now let's learn about the **`$implicit`** property. When the consumer writes a bare `let varName` - that is, `let` followed by a name **without** `= exportedProp` - Angular binds that variable to the `$implicit` property of the context. This is a convention: `$implicit` is the "default" export of a template context.

Add a `$implicit` property to `MyRepeatContext`. In the `MyRepeat` directive, a natural default export is the **computed value** for the current iteration (the value derived from the start, skip, and index):

```typescript
export interface MyRepeatContext {
  readonly $implicit: number;
  readonly index: number;
  readonly first: boolean;
  readonly last: boolean;
}
```

### Step 13
Update the template to use **both** a bare `let` (which maps to `$implicit`) and named bindings:

```html
<div *myRepeat="5; start: 100; skip: -10; let item; let i = index; let isLast = last">
  Value: {{ item }}, Index: {{ i }}, Last: {{ isLast }}
</div>
```

The bare `let item` desugars to `let-item` (with no value), which Angular binds to `context.$implicit`. The named bindings work as before.

### Step 14
Now define the context for `MyTimer`. Create a type alias for the timer state and a context interface:

```typescript
export type TimerState = 'running' | 'done';

export interface MyTimerContext {
  readonly value: number;
  readonly state: TimerState;
}
```

This context uses only **named properties** - no `$implicit`. Not every directive needs a default export. The timer exposes its current count as `value` and its running/done status as `state`.

### Step 15
In `app.html`, update the `*myTimer` usage with template variables:

```html
<div *myTimer="1000; from: 10; to: 0; let count = value; let s = state">
  Count: {{ count }}, State: {{ s }}
</div>
```

Verify no errors. The consumer uses `let count = value` and `let s = state` to capture the named context properties.

### Step 16
Take a moment to review the two binding patterns:
- **`let item`** (bare) → maps to `context.$implicit`. Useful when the directive has a single "obvious" value to export.
- **`let i = index`** (named) → maps to `context.index`. Useful for additional or auxiliary values.

Not every directive needs `$implicit` - `MyTimer` uses only named properties, which is perfectly valid. We will see `$implicit` used more naturally when we build `MyFor`, where `let item` represents the current iteration item.

---

## Phase 3 - Context Type Guards

If you hover over any of the `let-` variables in `app.html` right now - for example, `i` in the `*myRepeat` usage or `count` in the `*myTimer` usage - the IDE reports their type as **`any`**. We defined context interfaces, but Angular's template type checker does not know about them yet. To fix this, we need to add a **static type guard** method called `ngTemplateContextGuard` to each directive.

### Step 17
The `ngTemplateContextGuard` method has a specific signature:

```typescript
static ngTemplateContextGuard(dir: MyDirective, ctx: unknown): ctx is MyContextType {
  return true;
}
```

- The method is **`static`** - it is called by the compiler, not at runtime.
- The first parameter is the directive instance type.
- The second parameter is `unknown` - the untyped context.
- The return type is a **type predicate** (`ctx is MyContextType`) that narrows the context type.
- The body simply returns `true` - the narrowing is purely a compile-time mechanism.

### Step 18
Add the type guard to `MyRepeat`:

```typescript
static ngTemplateContextGuard(_: MyRepeat, ctx: unknown): ctx is MyRepeatContext {
  return true;
}
```

### Step 19
Add the type guard to `MyTimer`:

```typescript
static ngTemplateContextGuard(_: MyTimer, ctx: unknown): ctx is MyTimerContext {
  return true;
}
```

### Step 20
Go to `app.html` and hover over the `let-` variables:
- On the `*myRepeat` usage, hover over `i` - it should be `number`. Hover over `isLast` - it should be `boolean`.
- On the `*myTimer` usage, hover over `count` - it should be `number`. Hover over `s` - it should be `TimerState`.

The type guards have given the template type checker full knowledge of each context shape. From now on, as we evolve these context interfaces (e.g., upgrading to signals), the type guards will automatically reflect the updated types.

---

## Phase 4 - Upgrading Context Properties to Signals

In the previous phase we defined context properties as plain values. But consider what happens at runtime: a structural directive creates an embedded view and passes a context object. If the directive's **inputs change** (for example, `myRepeat` goes from `5` to `10`), the context values - like `last` - need to update for already-existing views. With plain values, the directive would need to either recreate the entire context object or manually update each property and trigger change detection.

**Signals** solve this elegantly. If context properties are signals, the directive can simply `.set()` a new value, and Angular's reactivity system takes care of the rest - no need to recreate the embedded view or its context.

### Step 21
In `my-repeat.directive.ts`, update `MyRepeatContext` to use `Signal` wrappers:

```typescript
export interface MyRepeatContext {
  readonly $implicit: Signal<number>;
  readonly index: Signal<number>;
  readonly first: Signal<boolean>;
  readonly last: Signal<boolean>;
}
```

Import `Signal` from `@angular/core`.

### Step 22
In `my-timer.directive.ts`, update `MyTimerContext` similarly:

```typescript
export interface MyTimerContext {
  readonly value: Signal<number>;
  readonly state: Signal<TimerState>;
}
```

### Step 23
In `app.html`, update the template expressions to **call** the signals (since signals are functions that return their current value):

```html
<ul>
  <li *myRepeat="5; start: 100; skip: -10; let item; let i = index; let isLast = last">
    Value: {{ item() }}, Index: {{ i() }}, Last: {{ isLast() }}
  </li>
</ul>

<div *myTimer="1000; from: 10; to: 0; let count = value; let s = state">
  Count: {{ count() }}, State: {{ s() }}
</div>
```

Verify no errors. The template variables now hold `Signal` values, so we read them with `()`.

### Step 24
Hover over the `let-` variables again. Thanks to the type guards we added in Phase 3, the IDE now reports the **updated** types: `i` is `Signal<number>`, `isLast` is `Signal<boolean>`, `count` is `Signal<number>`, `s` is `Signal<TimerState>`. The type guards automatically reflect the context interface changes - no updates needed to the guards themselves.

### Step 25
Note that the **microsyntax** itself (`let i = index`, `let count = value`) did not change - only the **template expressions** that use the variables changed (adding `()`). The microsyntax always binds to the context property regardless of its type. Whether the property is a `number`, a `Signal<number>`, or an `Observable<number>` is a decision the directive makes - the consumer just needs to know how to read the value.

---

## Phase 5 - The `as` Keyword

### Step 26
The `as` keyword in the microsyntax allows the consumer to **capture the value of the primary expression** into a template variable. For example:

```
*myTimer="1000 as interval"
```

This desugars to:

```html
<ng-template [myTimer]="1000" let-interval="myTimer">
  ...
</ng-template>
```

Notice: `as interval` becomes `let-interval="myTimer"`. Angular looks for a property called `myTimer` on the **template context** - a property with the **same name as the directive selector**. This is the mechanism behind the `as` keyword: it creates a template variable bound to a context property whose name matches the selector.

### Step 27
To support the `as` keyword on `MyTimer`, add a property named `myTimer` to `MyTimerContext`:

```typescript
export interface MyTimerContext {
  readonly myTimer: number;
  readonly value: Signal<number>;
  readonly state: Signal<TimerState>;
}
```

The `myTimer` context property would hold the interval value (the same value as the primary input). Note that this property is a plain `number`, not a signal - it mirrors the input expression's value.

### Step 28
In `app.html`, try using the `as` keyword:

```html
<div *myTimer="1000 as interval; from: 10; to: 0; let count = value; let s = state">
  Interval: {{ interval }}ms, Count: {{ count() }}, State: {{ s() }}
</div>
```

The `interval` variable captures the primary expression's value (`1000`) via the `myTimer` context property. Verify no errors.

### Step 29
Apply the same pattern to `MyRepeat`. Add a `myRepeat` property to `MyRepeatContext`:

```typescript
export interface MyRepeatContext {
  readonly myRepeat: number;
  readonly $implicit: Signal<number>;
  readonly index: Signal<number>;
  readonly first: Signal<boolean>;
  readonly last: Signal<boolean>;
}
```

Try it in `app.html`:

```html
<ul>
  <li *myRepeat="5 as total; start: 100; skip: -10; let item; let i = index; let isLast = last">
    {{ item() }} of {{ total }}: Index {{ i() }} {{ isLast() ? '(End of Batch)' : '' }}
  </li>
</ul>
```

### Step 30
The `as` keyword is **optional** - consumers only use it when they need to reference the primary expression's value inside the template. The context property named after the selector acts as the bridge that makes this possible. We will see this pattern again in Phase 6 with `MyIf`, where `*myIf="condition as result"` is the canonical use case.

---

## Phase 6 - Recreating the `*ngIf` and `*ngFor` APIs

Now that we understand all the building blocks - primary inputs, secondary inputs, context properties, `$implicit`, signals, the `as` keyword, and type guards - we will use this knowledge to recreate the API surface of Angular's built-in `*ngIf` and `*ngFor` directives in our `MyIf` and `MyFor` directives. For each one we will add inputs, a context interface, a type guard, and verify the types in the IDE.

### `MyIf` - Mirroring `*ngIf`

### Step 31
Open `directives/my-if.directive.ts`. Add a **required boolean input** named `myIf`:

```typescript
readonly myIf = input.required<boolean>();
```

This is the primary input. `*myIf="4 < 5"` desugars to `[myIf]="4 < 5"`.

### Step 32
Define the context interface. The built-in `NgIfContext` has a single property named `ngIf` - the same name as the selector. This enables the `as` keyword:

```typescript
export interface MyIfContext {
  readonly myIf: boolean;
}
```

When the consumer writes `*myIf="4 < 5 as cond"`, Angular desugars `as cond` to `let-cond="myIf"`, which binds `cond` to `context.myIf`. The context property name **must** match the directive selector for the `as` keyword to work.

### Step 33
Add the **type guard** so that `cond` is typed as `boolean` rather than `any`:

```typescript
static ngTemplateContextGuard(_: MyIf, ctx: unknown): ctx is MyIfContext {
  return true;
}
```

### Step 34
In `app.html`, update the `*myIf` usage:

```html
<h2 *myIf="4 < 5 as cond">Hi there, {{ cond }}</h2>
```

This desugars to:

```html
<ng-template [myIf]="4 < 5" let-cond="myIf">
  <h2>Hi there, {{ cond }}</h2>
</ng-template>
```

Verify no errors. Hover over `cond` - it should be `boolean`. Compare this to Angular's `*ngIf="condition as value"` - it uses exactly the same mechanism.

### `MyFor` - Mirroring `*ngFor`

### Step 35
Open `directives/my-for.directive.ts`. The built-in `*ngFor` uses the `of` keyword: `*ngFor="let item of items"`. The `of` keyword is just another microsyntax key - Angular concatenates it with the selector:

`of` → `myFor` + `Of` → `myForOf`

So `let item of [1, 2, 3]` desugars to:

```html
<ng-template [myForOf]="[1, 2, 3]" let-item>
  ...
</ng-template>
```

Notice two things:
1. `of [1, 2, 3]` maps to the `[myForOf]` input (not `[myFor]` - the primary input is never populated because the expression starts with `let`).
2. `let item` (bare) maps to `$implicit` on the context.

Add the `myForOf` input to the directive:

```typescript
readonly myForOf = input.required<any[]>();
```

(We will make this generic shortly.)

### Step 36
Add the `trackBy` input. The `trackBy` key follows the same naming rule:

`trackBy (y, z) => z` → `myFor` + `TrackBy` → `[myForTrackBy]="(y, z) => z"`

```typescript
readonly myForTrackBy = input<(item: any, index: number) => any>((x, y) => x);
```

Note that the `trackBy` expression in the microsyntax does not require a colon - `trackBy (y, z) => z` is equivalent to `trackBy: (y, z) => z`. The colon is optional for key–value pairs.

### Step 37
Define the context interface. The built-in `NgForOfContext` has `$implicit`, `index`, `first`, `last`, `even`, and `odd`:

```typescript
export interface MyForContext {
  readonly $implicit: any;
  readonly index: number;
  readonly first: boolean;
  readonly last: boolean;
  readonly even: boolean;
  readonly odd: boolean;
}
```

Here `$implicit` carries the current iteration item - this is what `let item` (bare) resolves to. The positional properties (`index`, `first`, `last`, `even`, `odd`) use plain values (not signals), reflecting a different implementation strategy than `MyRepeat`.

### Step 38
In `app.html`, update the `*myFor` usage:

```html
<div *myFor="let item of [1, 2, 3]; let i = index; let o = odd; trackBy (y, z) => z">
  {{ item }}
</div>
```

Verify no errors. The bare `let item` maps to `$implicit`, while `let i = index` and `let o = odd` map to named properties.

### Making `MyFor` Generic

### Step 39
Hover over `item` in the `*myFor` usage - it is `any`. This is because `MyForContext` uses `any` for `$implicit`. We could simply change it to `number`, but that would only work for number arrays. What we really want is for the type to be **inferred** from the input expression - `number` for `[1, 2, 3]`, `string` for `['a', 'b']`, etc.

To achieve this, make `MyFor` a **generic directive**. Update the class and the `myForOf` input:

```typescript
export class MyFor<T> {
  readonly myForOf = input.required<T[]>();
  readonly myForTrackBy = input<MyForTrackBy<T>>((x, y) => x);
}
```

You can also extract a type alias for the track-by function:

```typescript
export type MyForTrackBy<T> = (item: T, index: number) => any;
```

Angular will **infer** `T` from the bound expression - for `[1, 2, 3]`, `T` is `number`.

### Step 40
Make the context interface generic as well:

```typescript
export interface MyForContext<T> {
  readonly $implicit: T;
  readonly index: number;
  readonly first: boolean;
  readonly last: boolean;
  readonly even: boolean;
  readonly odd: boolean;
}
```

Now `$implicit` carries the inferred item type instead of `any`.

### Step 41
Add a **generic type guard**. The static method must also be generic so that `T` flows from the directive instance to the context:

```typescript
static ngTemplateContextGuard<T>(_: MyFor<T>, ctx: unknown): ctx is MyForContext<T> {
  return true;
}
```

Note the `<T>` on the static method - this allows the compiler to infer `T` from the directive instance (which got `T` from the `myForOf` input) and propagate it to the context type. Without the generic parameter, `$implicit` would be typed as `unknown`.

### Step 42
Go back to `app.html` and hover over `item` in the `*myFor` usage - it should now be `number` (inferred from `[1, 2, 3]`). Hover over `i` - it should be `number`. Hover over `o` - it should be `boolean`.

Try changing the array to `['a', 'b', 'c']` and hover over `item` again - the type should change to `string`. This is the power of the generic type guard: `T` is inferred from the input and flows through to every template variable type.

---

## Final Verification

### Step 43
Update `app.html` to include all four directives with their full microsyntax:

```html
<h2 *myIf="4 < 5 as cond">Hi there, {{ cond }}</h2>

<div *myFor="let item of [1, 2, 3]; let i = index; let o = odd; trackBy (y, z) => z">
  {{ item }}
</div>

<ul>
  <li *myRepeat="5; start: 100; skip: -10; let i = index; let isLast = last">
    Item Code: {{ i() }} {{ isLast() ? '(End of Batch)' : '' }}
  </li>
</ul>

<div *myTimer="1000; from: 10; to: 0; let count = value; let s = state">
  @if (s() === 'running') {
    <p>Counting down: {{ count() }}</p>
  } @else {
    <p>Blast off! 🚀</p>
  }
</div>
```

### Step 44
Verify the following:
- The IDE shows **no template errors** on any of the four usages.
- Hovering over `let-` variables shows the **correct types** - not `any`.
- The application **builds successfully** with `ng build` (even though the directives produce no visible output since they have no implementation).

### Step 45
Take a moment to review what we have built. Each directive has:
- **Inputs** that the microsyntax populates - a primary input (same name as the selector) and optional secondary inputs (named `selectorKey`).
- A **context interface** that defines what template variables are available to consumers via `let-` bindings - including the special `$implicit` property for bare `let` declarations and named properties matching the selector for the `as` keyword.
- **Signal-based** context properties where reactive updates are needed (`MyRepeat`, `MyTimer`), and plain values where they are not (`MyFor`, `MyIf`).
- A **static type guard** (`ngTemplateContextGuard`) that gives the template type checker full knowledge of the context shape - including generic type flow for `MyFor`.

The directives have **no runtime behavior** - they don't inject `TemplateRef` or `ViewContainerRef`, don't create or destroy views, and don't manage any state. Yet the microsyntax works at the type level: the desugaring is correct, the bindings resolve, and the types flow through. This demonstrates that the **API surface** (inputs + context + type guard) is a completely separate concern from the **implementation** (view management), and can be designed and validated independently.
