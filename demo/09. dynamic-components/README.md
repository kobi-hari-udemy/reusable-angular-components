# Practice 17 - Dynamic Components

In this exercise we will make the product catalog more flexible by reading both the available views and the component that picks the active view from configuration. The application already has three possible view components:

- `GridViewComponent`
- `ListViewComponent`
- `CardsViewComponent`

It also has two possible picker components:

- `SelectPickerComponent`
- `TabPickerComponent`

The configuration is already defined through dependency injection:

- `VIEW_OPTIONS` provides the available views and their component types.
- `VIEW_PICKER` provides the picker component type to use.

Right now the app is still hard-coded to render `app-select-picker` and `app-list-view`. We will remove those hard-coded references and rebuild the screen in phases using dynamic component techniques.

The starting project already contains:

- An `App` component with `selectedView`, `products`, and `selectedProduct` signals.
- A `VIEW_OPTIONS` token that lists the `grid`, `list`, and `cards` views.
- A `VIEW_PICKER` token that currently points to `SelectPickerComponent`.
- View components that know how to render the product list.
- Picker components that expose `options` and `value` as signal-based inputs.

---

## Phase 1 - Dynamically Rendering the Active View

In this phase we stop hard-coding the main view component and instead let the selected option decide which component Angular should render.

We will use `ngComponentOutlet` in the `App` template to render the active view. The key idea is that the selected view is just a string such as `grid`, `list`, or `cards`, while `ngComponentOutlet` needs the actual component type. So the first thing we need is a computed signal that resolves the selected string into a real component class.

### Step 1
Add a computed signal called `activeViewComponent` to the `App` component.

```typescript
readonly activeViewComponent = computed(() => {
  const found = this.viewOptions.find((v) => v.value === this.selectedView());
  return found?.component ?? GridViewComponent;
});
```

This looks up the selected view in `VIEW_OPTIONS` and returns the matching component type. If nothing matches, fall back to `GridViewComponent`.

At this point you are not rendering anything dynamically yet. You are only deciding which component class should be active.

### Step 2
Now remove the hard-coded `<app-list-view />` from the template.

Replace it with:

```html
<ng-container
  *ngComponentOutlet="activeViewComponent()"
/>
```

If you look at the devtools you will see that the correct component is being created, but it does not render anything because we are not passing any inputs to it yet. That is the next step.

### Step 3
Add a computed signal called `activeViewInputs`.

```typescript
readonly activeViewInputs = computed(() => ({
  items: this.products(),
}));
```

For now the only input every view needs is the list of products.

### Step 4
Update the template so `ngComponentOutlet` also receives those inputs.

```html
<ng-container
  *ngComponentOutlet="activeViewComponent(); inputs: activeViewInputs()"
/>
```

Now the active view should render the products correctly. You can verify this by switching `selectedView` between `grid`, `list`, and `cards` and confirming the UI updates accordingly. But as you see, clicking a product does not update the details panel anymore. That is because we have not wired the outputs yet. We will do that in the next phase.

### Conclusion
At the end of this phase:

- Changing `selectedView` should switch between grid, list, and cards.
- The rendered component type should come from `VIEW_OPTIONS`, not from a hard-coded template reference.
- The products should still render in the active view because we passed them through `inputs`.
- Clicking a product does not update the details panel yet because we have not wired the outputs.
- If you investigate the documentation for `ngComponentOutlet`, you will see that it does not have a built-in way to bind to outputs. We will solve that in the next phase by passing callbacks through dependency injection instead of using outputs.

---

## Phase 2 - Passing Actions Through Dependency Injection

In this phase we hit the first limitation of `ngComponentOutlet`: passing inputs is easy, but listening to outputs is not. The view components currently expose a `selection` output, but `ngComponentOutlet` does not give us a convenient template binding like `(selection)="..."`.

To solve this, we will pass callbacks through dependency injection instead of using outputs. The project already includes the `VIEW_ACTIONS` token for exactly this purpose.

### Step 5
In the `App` component, create a `ViewActions` object that handles selection.

Its `onItemSelect` callback should set `selectedProduct`.

The intent is:

```typescript
readonly viewActions: ViewActions = {
  onItemSelect: (product) => {
    this.selectedProduct.set(product);
  }
};
```

### Step 6
Create a custom injector in the `App` component that provides `VIEW_ACTIONS`.

Use `Injector.create(...)` with the app injector as the parent, and provide the `viewActions` object as the value for `VIEW_ACTIONS`.

This injector is the `viewActionsInjector` referenced in the `ngComponentOutlet` template.

### Step 7
Update each view component so it injects `VIEW_ACTIONS` and uses `actions.onItemSelect(product)` when a product is clicked.

In other words, instead of emitting through the `selection` output, the view should notify the host through the injected callback.

The click handler should move toward this shape:

```typescript
private readonly actions = inject(VIEW_ACTIONS);

onItemClick(product: Product) {
  this.actions.onItemSelect(product);
}
```

### Step 8
Remove any output API that is no longer needed from the view components.

By the end of this phase:

- The app still renders the selected view dynamically.
- Clicking a product still updates the details panel.
- The selection behavior is now wired through `VIEW_ACTIONS` and a custom injector rather than component outputs.

---

## Phase 3 - Dynamically Creating the Picker Component

In this phase we do for the picker what we already did for the view: stop hard-coding the concrete component in the template.

The difference is that this time we will not use `ngComponentOutlet`. These picker components are general-purpose and we do not want to change their public API just to fit this screen. Instead, we will create the picker component programmatically and bind to it in code.

The `VIEW_PICKER` token already tells us which picker component type to use.

### Step 9
Remove the hard-coded `<app-select-picker />` from the template.

### Step 10
Add a template reference point right after the `<h1>` in the header so the picker can be inserted there dynamically.

For example, attach a template reference variable to the `<h1>`:

```html
<h1 #pickerAnchor>Product Catalog</h1>
```

### Step 11
Use `viewChild` in the `App` component to get access to the `ViewContainerRef` represented by that template anchor.

The goal is to obtain a container that points to the location just after the `<h1>` so Angular can create the configured picker there.
The code should look like this:

```typescript
readonly pickerVcr = viewChild('pickerAnchor', { read: ViewContainerRef });
```

Notice that we use the `read` option to get the `ViewContainerRef` instead of the default `ElementRef`. This is what allows us to create components at that location.

### Step 12
Inject `VIEW_PICKER`, then create the picker component programmatically from that configured type.

At this stage, the code should conceptually look like this:

```typescript
const pickerType = inject(VIEW_PICKER);
```

and later:

```typescript
this.pickerVcr().createComponent(pickerType);
```

You can do this in the constructor, in an effect, or in another lifecycle-friendly place as long as the view container exists before you try to create the component.

By the end of this phase:

- The picker location in the template is just an anchor.
- The actual picker component comes from the `VIEW_PICKER` token.
- Switching the configuration from `SelectPickerComponent` to `TabPickerComponent` should swap the UI without rewriting the template.

---

## Phase 4 - Binding Picker Inputs and the Two-Way Model

In this final phase we wire the dynamically created picker to the app state.

The picker components already expose the exact API we need:

- `options` is a required input
- `value` is a required model input

Because the picker is being created in code, we need to populate those bindings programmatically.

### Step 13
When creating the picker component, bind its `options` input to the `views` computed signal.

### Step 14
Also bind its `value` model to the `selectedView` signal so the picker and the app stay in sync in both directions.

Use Angular's dynamic component binding helpers to express those bindings directly during component creation.

The intended shape is:

```typescript
this.pickerVcr().createComponent(this.viewPicker, {
  bindings: [
    inputBinding('options', this.views),
    twoWayBinding('value', this.selectedView),
  ],
});
```

This is the key advantage of the programmatic approach here: we keep the picker components generic and still provide the same behavior a normal template binding would have offered.

### Step 15
Verify both configured picker components:

- With `SelectPickerComponent`, the dropdown updates `selectedView`.
- With `TabPickerComponent`, the active tab updates `selectedView`.
- In both cases, changing the picker swaps the dynamically rendered main view.

---

## Expected Result

By the end of the exercise:

- The active catalog view is chosen from `VIEW_OPTIONS`.
- The active view component is rendered through `ngComponentOutlet`.
- The view receives its `items` through `activeViewInputs()`.
- Product selection is handled through the `VIEW_ACTIONS` injection token and a custom injector.
- The picker component is chosen from `VIEW_PICKER`.
- The picker is inserted dynamically using a `ViewContainerRef` anchored in the template.
- The picker's `options` input and `value` model are bound programmatically.
- Changing configuration can swap both the picker UI and the main content view without changing the app template structure.

---

## Suggested Checks

After you finish, test the following:

- The app initially renders the configured default view.
- Selecting `Grid`, `List`, and `Cards` swaps the main content correctly.
- Clicking a product still updates the detail sidebar.
- Changing `VIEW_PICKER` in `app.config.ts` from `SelectPickerComponent` to `TabPickerComponent` swaps the selector UI with no additional app changes.
- No view or picker is hard-coded in the `App` template anymore.
