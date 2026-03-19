# Practice 16 - Microsyntax Playground (`withDateLocale`)

In this exercise we will create a custom `*withDateLocale` structural directive that wraps its host element in a child injector providing a specific date locale. This lets us dynamically switch the locale used by Angular Material's `mat-calendar` without rebuilding the entire component tree manually. We will start by defining the directive API, then wire it up to `TemplateRef` and `ViewContainerRef`, and finally build the child injector that supplies `MAT_DATE_LOCALE` and the native date adapter.

The starting project already contains:
- An `App` component with a `selectedLocale` signal and a list of available locales.
- A template that renders a locale `<select>` and a `<mat-calendar />`.

The application template uses the directive like this:

```html
<mat-calendar *withDateLocale="selectedLocale()" />
```

Right now the calendar renders without any locale awareness. The directive does not exist yet. We will build it step by step.

---

## Phase 1 - Defining the Directive API

In this phase we define the overall syntax and the public API of the directive. Because the microsyntax `*withDateLocale="selectedLocale()"` desugars into a single binding, the directive needs exactly one required input whose name matches the selector. There is no template context needed here — the directive does not expose any variables to the host template.

### Step 1
Create a new file `src/app/directives/with-date-locale.directive.ts` and scaffold a directive class called `WithDateLocale`.

Use the selector `[withDateLocale]` so it activates as an attribute structural directive.

### Step 2
Add a required signal input called `withDateLocale` of type `string`.

```typescript
readonly withDateLocale = input.required<string>();
```

This input will receive the locale string from the microsyntax binding. Because the input name matches the selector, the desugared `[withDateLocale]="selectedLocale()"` binding connects automatically.

Notice that unlike `*myRepeat` or `*myTimer`, there is no context type to define. The directive does not expose any `let` variables - it only controls which injector the host element sees.

---

## Phase 2 - Injecting the Structural Directive Primitives

In this phase we inject the two building blocks every structural directive needs: the template and the view container.

### Step 3
Inject `TemplateRef` and `ViewContainerRef` into the directive.

```typescript
private readonly template = inject(TemplateRef);
private readonly vcr = inject(ViewContainerRef);
```

You should end up with access to:
- The template that belongs to `*withDateLocale` (the `<mat-calendar>` element)
- The container where that template will be rendered

---

## Phase 3 - Reacting to Locale Changes

In this phase we set up the reactive flow. Whenever the locale input changes, the directive should re-render the embedded view with a fresh injector. We use the same `effect` + `invalidate` pattern we have seen in previous directives.

### Step 4
Create a private method called `invalidate()`.

This method will become the single place where the directive tears down the previous view and creates a new one with the updated locale.

### Step 5
Inside the constructor, create an `effect` that calls `invalidate()`.

```typescript
constructor() {
  effect(() => {
    this.invalidate();
  });
}
```

Because `invalidate()` will read `this.withDateLocale()`, the effect will rerun whenever the selected locale changes.

---

## Phase 4 - Building the Child Injector

In this phase we implement `invalidate()`. The key idea is that `MAT_DATE_LOCALE` and the native date adapter are provided through dependency injection. To change the locale at runtime, we need to create a new child injector that supplies these providers with the updated locale value, and then pass that injector to the embedded view.

### Step 6
Inject `Injector` into the directive.

```typescript
private readonly injector = inject(Injector);
```

We need the current injector so we can create a child injector that inherits all existing providers and adds the locale-specific ones on top.

### Step 7
Inside `invalidate()`, read the current locale from the input:

```typescript
const locale = this.withDateLocale();
```

### Step 8
Create a child injector using `Injector.create(...)` with two providers:
1. The full set of providers returned by `provideNativeDateAdapter()` — this registers the date adapter, date formats, and related services.
2. A value provider for `MAT_DATE_LOCALE` set to the current locale string.

```typescript
const viewInjector = Injector.create({
  parent: this.injector,
  providers: [
    ...provideNativeDateAdapter(),
    {
      provide: MAT_DATE_LOCALE,
      useValue: locale
    }
  ]
});
```

By setting `parent` to the directive's own injector, the child injector inherits everything the rest of the application provides but overrides the locale and adapter with fresh instances.

---

## Phase 5 - Creating the Embedded View

In this phase we use the child injector to stamp out the embedded view.

### Step 9
Before creating a new view, clear the container to remove the previous one:

```typescript
this.vcr.clear();
```

Unlike `*myRepeat`, this directive always renders exactly one view. Clearing ensures we do not accumulate stale views when the locale changes.

### Step 10
Create the embedded view from the template and pass the child injector:

```typescript
this.vcr.createEmbeddedView(this.template, undefined, {
  injector: viewInjector
});
```

The second argument is `undefined` because there is no template context - the directive does not expose any `let` variables. The third argument passes the `viewInjector` so the `mat-calendar` inside the template resolves `MAT_DATE_LOCALE` from the child injector rather than the root.

---

## Phase 6 - Testing the Directive

### Step 11
Import `WithDateLocale` into the `App` component and add the structural directive to the `<mat-calendar>` element:

```html
<mat-calendar *withDateLocale="selectedLocale()" />
```

### Step 12
Serve the application and verify the runtime behavior:
- The calendar renders with the default locale (`fr-FR`).
- Changing the locale dropdown updates the calendar headers, day names, and month names to match the selected locale.
- Switching between LTR and RTL locales (for example `en-US` → `he-IL` → `ar-EG`) correctly reflects the writing direction inside the calendar.
- No errors appear in the console during locale switches.

### Step 13
Take note of the design pattern here:
- The directive does not know or care what it wraps. It works with any template.
- The child injector overrides only the locale-related providers while inheriting everything else from the parent.
- Because the effect calls `invalidate()`, every locale change destroys the old view and creates a new one with a fresh injector. This guarantees the `mat-calendar` re-initializes with the correct locale rather than trying to patch an existing one.

---

## Expected Result

By the end of the exercise:
- `WithDateLocale` is a standalone structural directive with a single required `string` input.
- It injects `TemplateRef`, `ViewContainerRef`, and `Injector`.
- An `effect` calls `invalidate()` whenever the locale input changes.
- `invalidate()` clears the container, builds a child injector with `provideNativeDateAdapter()` and `MAT_DATE_LOCALE`, and creates a fresh embedded view with that injector.
- The `mat-calendar` inside the template picks up the new locale on every change.
