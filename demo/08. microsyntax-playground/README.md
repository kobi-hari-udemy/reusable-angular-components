# Practice 15 - Microsyntax Playground (`myRepeat`)

In this exercise we will take the custom `*myRepeat` directive from the microsyntax playground and turn it into a real structural directive that can stamp out a dynamic number of embedded views. We will start by wiring the directive up to `TemplateRef` and `ViewContainerRef`, then we will make the incremental DOM updates incremental while building a signal-based context for each repeated view.

The starting project already contains a `MyRepeat` directive with these inputs:
- `myRepeat` for the number of views to render.
- `myRepeatStart` for the first numeric value exposed to the template.
- `myRepeatSkip` for the amount added between repeated values.

The application template uses the directive like this:

```html
<li class="content-presenter" 
	*myRepeat="
	  count() as c;
	  start: start();
	  skip: skip();
	  let v;
	  let i = index;
	  let f = first;
	  let l = last
	"
	[class.first]="f()" [class.last]="l()">
	<span class="index">{{i()}}</span>
	<span class="seperator">/</span>
	<span class="count">{{c()}}</span>
	<span class="value-label">Value</span>
	<span class="value">{{v()}}</span>
</li>
```

Right now the directive has the inputs and the template context type, but it does not inject the template, it does not manage any embedded views, and it does not provide the live context values that the template expects.

---

## Phase 1 - Wiring Up the Structural Directive

In this phase we set up the directive so Angular gives us the tools needed to render repeated views. The directive will not contain the full repeat logic yet, but it should already have the right structural shape.

### Step 1
Open `src/app/directives/my-repeat.directive.ts` and inject both `ViewContainerRef` and `TemplateRef<MyRepeatContext>` into the directive.

You should end up with access to:
- The template that belongs to `*myRepeat`
- The container that will hold the embedded views created from that template

### Step 2
Create a private method called `invalidate()`.

This method will become the single place where the directive makes sure the rendered views match the current values of the inputs.

### Step 3
Inside the constructor, create an `effect` that calls `invalidate()`.

At this stage the important idea is not the DOM logic yet. The important idea is the reactive flow:

1. One of the inputs changes
2. The effect reruns
3. `invalidate()` brings the rendered views back in sync

Because `invalidate()` will eventually read the directive inputs, the effect will rerun whenever those inputs change.

---

## Phase 2 - Removing Excess Views 

In this phase we begin implementing `invalidate()`. The main design goal is to minimize changes to the DOM. We do not want to clear the entire container and recreate every view on each update because that would throw away existing DOM nodes and embedded view instances unnecessarily.

Instead, we want to keep any views that are still valid, remove only the extra views when the count goes down, and add only the missing views when the count goes up. This works well because each view context is built out of signals, so the existing views can react to updated inputs automatically without needing to be recreated.

We will start with the removal logic.

### Step 4
Inside `invalidate()`, read the current repeat count into a local variable:

```typescript
const count = this.myRepeat();
```

This makes the desired number of rendered views explicit.

### Step 5
Add a loop that removes views from the end of the container while the container has more views than `count`.

The logic should follow this shape:

```typescript
while (this.vcr.length > count) {
	this.vcr.remove(this.vcr.length - 1);
}
```

Removing from the end is important because the existing views do not move. The views at lower indexes remain where they are, and only the excess tail of the repeated output is discarded.

### Step 6
Pause and verify the invariant you are building toward:
- If the count decreases, only the extra trailing views should be removed.
- If the count stays the same, existing views should remain in place.
- If the count later increases, we will add only the missing views rather than rebuilding the whole list.

This is the core reason the implementation uses `invalidate()` rather than `clear()` plus full recreation.

---

## Phase 3 - Building a Signal-Based Context for New Views

In this phase we add the logic for missing views. Every new view needs a context object that exposes the values used by the microsyntax: the implicit value, the index, the first and last flags, and the repeat count.

The important detail is that almost all of these values should be computed signals. They are derived from other signals and should stay reactive automatically.

### Step 7
Still inside `invalidate()`, add a second loop that runs while the container has fewer views than `count`.

This loop is responsible for preparing one new context object per missing view.

### Step 8
Inside that loop, create an `index` signal based on the current container length:

```typescript
const index = signal(this.vcr.length).asReadonly();
```

Even though `index` is a signal, it never actually changes after creation. That is intentional. A repeated view keeps its position because this directive does not reorder or move existing views. It only removes trailing views or appends new ones.

### Step 9
Create computed signals for `first` and `last`.

The rules are:
- `first` is `true` when `index()` is `0`
- `last` is `true` when `index()` is `this.myRepeat() - 1`

For example:

```typescript
const first = computed(() => index() === 0);
const last = computed(() => index() === (this.myRepeat() - 1));
```

Notice that `last` depends on `this.myRepeat()`. That means existing views can react when the repeat count changes, even if the view itself is preserved.

### Step 10
Expose the `myRepeat` input itself through the template context by reusing the input signal:

```typescript
const myRepeat = this.myRepeat;
```

This lets the template read the current count reactively through the `as c` syntax.

### Step 11
Create the implicit repeated value as a computed signal:

```typescript
const value = computed(() => this.myRepeatStart() + index() * this.myRepeatSkip());
```

This is the number each repeated view should expose as `$implicit`.

Notice what this means conceptually:
- `index` identifies which repeated view this is
- `myRepeatStart()` provides the initial value
- `myRepeatSkip()` provides the spacing between values
- `value` is derived state and updates automatically when start or skip change

### Step 12
At this point you should have all the context pieces needed for a new view:
- `$implicit`
- `index`
- `first`
- `last`
- `myRepeat`

All of them should be signals, and all except `index` should be computed or forwarded from existing signals.

---

## Phase 4 - Creating the Missing Embedded Views

In this phase we use the context built in the previous phase to actually stamp out the missing views.

### Step 13
Inside the same `while (this.vcr.length < count)` loop, call `createEmbeddedView(...)` with the injected template and the constructed context object.

The shape should be:

```typescript
this.vcr.createEmbeddedView(this.template, {
	$implicit: value,
	index,
	first,
	last,
	myRepeat
});
```

This creates exactly one new repeated view for each pass through the loop.

### Step 14
Verify the full runtime behavior in the app:
- Increasing `Count` should append only the missing views.
- Decreasing `Count` should remove only the extra trailing views.
- Changing `Start` should update the values shown in the existing views.
- Changing `Skip` should recompute the repeated values without rebuilding the whole list.
- The first and last CSS classes should move correctly as the count changes.

### Step 15
Take note of the design pattern here:
- `ViewContainerRef` owns the repeated embedded views
- `invalidate()` keeps the number of views correct
- Each embedded view gets a context made of signals
- Existing views stay alive and update themselves reactively through those signals

That combination is what makes the directive efficient and predictable.

---

## Expected Result

By the end of the exercise:
- `MyRepeat` injects `TemplateRef` and `ViewContainerRef`.
- An `effect` calls `invalidate()` whenever the directive inputs change.
- `invalidate()` removes only excessive trailing views instead of clearing the whole container.
- Missing views are added one at a time with a signal-based template context.
- `index` is stable per view because existing views never move.
- `$implicit`, `first`, `last`, and `myRepeat` remain reactive through signals.
- The repeated output updates correctly when the count, start, or skip values change.
