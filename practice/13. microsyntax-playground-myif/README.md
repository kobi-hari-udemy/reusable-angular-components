# Practice 13 - Microsyntax Playground (`myIf`)

In this exercise we will take the custom `*myIf` directive from the previous microsyntax playground and turn it into a real structural directive. We will start by learning how `TemplateRef` and `ViewContainerRef` work together to stamp out embedded views, then we will implement the actual runtime behavior of an `if` directive, and finally we will make the directive type-safe so Angular understands that values exposed through `as` are truthy inside the template.

The starting project already contains a `MyIf` directive with a required `myIf` input and a basic `MyIfContext<T>` interface. The application template uses the directive in two ways:
- `*myIf="flag()"` to show or hide some simple content.
- `*myIf="obj() as item"` to expose the bound object through the `as` syntax.

Right now the directive does not render anything because it never creates an embedded view. It also does not narrow the type of `item`, so the template currently needs non-null assertions on lines 19 and 20.

---

## Phase 1 - Creating Embedded Views

In this phase we learn how a structural directive renders template content. A structural directive does not manipulate the host element directly. Instead, Angular gives it a `TemplateRef`, which represents the template to stamp out, and a `ViewContainerRef`, which is the place where those stamped views are inserted.

### Step 1
Open `directives/my-if.directive.ts` and inject both `TemplateRef` and `ViewContainerRef` into the directive. You can use the `inject` function or constructor injection.

You should end up with access to:
- The template that belongs to `*myIf`
- The container that will hold the embedded views created from that template

### Step 2
Use `ViewContainerRef.createEmbeddedView(...)` to create an embedded view from the injected template.

Pass a context object when creating the view so the template can still access the value through the `myIf` context property:

```typescript
this.viewContainerRef.createEmbeddedView(this.templateRef, {
	myIf: this.myIf(),
});
```

At this point, as soon as the directive runs, the content inside `*myIf` should appear.

### Step 3
To understand that a `TemplateRef` can be stamped multiple times, temporarily create more than one embedded view from the same template.

For example, call `createEmbeddedView(...)` several times and observe that the exact same template content is repeated multiple times in the DOM. This is the core idea behind structural directives such as loops and repeaters: one template can produce many rendered views.

### Step 4
Once you have confirmed that repeated view creation duplicates the template, reduce the code back to a single embedded view. This keeps the directive ready for the next phase, where we will control whether that one view should exist at all.

---

## Phase 2 - Implementing the `if` Behavior

In this phase we stop treating `myIf` as "always render once" and instead make the directive behave like a real conditional structural directive.

### Step 5
Create a computed signal called `condition` inside the directive. This signal should derive a boolean value from the `myIf` input.

The goal is simple:
- Truthy input value → condition is `true`
- Falsy input value → condition is `false`

This mirrors how Angular's built-in `*ngIf` interprets values.

### Step 6
Add an `effect` that reacts to `condition()` and delegates the actual DOM work to a `invalidate()` method.

The directive should no longer directly create views in the constructor. Instead, the reactive flow should be:

1. `myIf()` changes
2. `condition()` recomputes
3. the `effect` runs
4. `invalidate()` updates the `ViewContainerRef`

### Step 7
Implement `invalidate()` so the container always matches the condition.

The rules are:
- If the container is empty and the condition is `true`, create one embedded view.
- If the container is not empty and the condition is `false`, clear or remove the embedded view.
- Otherwise, do nothing.

This gives the directive the invariant of having either exactly one view or zero views.

### Step 8
When creating the embedded view inside `invalidate()`, keep passing the context object:

```typescript
{
	myIf: this.myIf(),
}
```

This ensures that the `as` syntax continues to map to the value exposed by the directive.

### Step 9
Verify the runtime behavior in the app:
- Clicking `Toggle Flag` should show and hide the first block.
- Clicking `Toggle Object` should show and hide the second block.
- When the object becomes truthy again, the content should render correctly from a newly created embedded view.

---

## Phase 3 - Narrowing the Template Type

At this point the directive behaves correctly at runtime, but the template still has a type-safety issue. In `app.html`, the object block currently needs non-null assertions:

```html
X: {{item!.x}}
Y: {{item!.y}}
```

Those `!` operators are there because Angular still thinks `item` could be `null`. But logically, that cannot happen inside the template: the block only exists when the `myIf` condition is truthy.

### Step 10
Add a binding type guard to the directive so Angular knows that the presence of the embedded view depends on the truthiness of the `myIf` input.

Use the same pattern Angular uses for `NgIf`:

```typescript
static ngTemplateGuard_myIf: 'binding' = 'binding';
```

This tells Angular to treat the binding itself as the condition that guards the template.

### Step 11
Create a helper type that removes falsy values from `T`. A typical version is:

```typescript
type MyIfTruthy<T> = Exclude<T, false | 0 | '' | null | undefined>;
```

This expresses the real runtime contract of the directive: if the template exists, the value exposed through `myIf` is a truthy version of `T`.

### Step 12
Update `ngTemplateContextGuard` so it narrows the context to `MyIfContext<MyIfTruthy<T>>` instead of `MyIfContext<T>`.

That means the value exposed by the `as` syntax is no longer the original possibly-null type. It is the truthy, narrowed type that is safe to use inside the block.

### Step 13
Verify that the template no longer needs the non-null assertions on lines 19 and 20 of `app.html`. After the guard is in place, you should be able to write:

```html
X: {{item.x}}
Y: {{item.y}}
```

Angular should now understand that `item` cannot be `null` inside the `*myIf="obj() as item"` block.

### Step 14
Take note of the two pieces that work together here:
- `ngTemplateGuard_myIf` tells Angular that the binding controls whether the template exists.
- `ngTemplateContextGuard` tells Angular what the template context looks like when that template does exist.

Together, these allow a custom structural directive to provide the same kind of template type narrowing that developers expect from Angular's built-in `*ngIf`.

---

## Expected Result

By the end of the exercise:
- `MyIf` creates and removes embedded views using `ViewContainerRef`.
- The directive behaves like a real conditional structural directive.
- The `as` syntax continues to work through the `myIf` context property.
- The template type checker understands that values inside the `*myIf` block are truthy, so the non-null assertions can be removed.
