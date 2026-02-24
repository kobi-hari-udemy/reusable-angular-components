# Practice 8 - Multi-Slot Content Projection

In this exercise we will refactor the `ExpanderComponent` to use **multi-slot content projection**. The component currently uses a `header` string input for the header text and a default `<ng-content>` for the body. We will progressively move the header into projected content as well, learning how to target specific elements with `<ng-content select="...">`.

The project also includes an `Icon` component (`components/icon/`) that renders SVG icons. It has a required `name` input that accepts one of the known icon names: `projection`, `cogwheel`, `modularity`, or `chevron`. Usage example: `<app-icon name="projection" />`.

---

## Phase 1 - Move the header into projected content

### Step 1
Remove the `header` string input from the `ExpanderComponent`.

### Step 2
In `app.html`, remove the `header` attribute bindings from each `<app-expander>`. Instead, add an `<h1>` element **inside** each expander with the header text as its content. For example:

```html
<app-expander>
  <h1>What is Content Projection?</h1>
  <!-- ...rest of the body content... -->
</app-expander>
```

### Step 3
Run the application and notice that the `<h1>` elements now appear **inside the content area** together with the rest of the body - the header area is empty. This is because the default `<ng-content>` projects everything.

---

## Phase 2 - Select by element name

### Step 4
In `expander.html`, replace the `{{ header() }}` interpolation inside the `.header-area` div with a **targeted** `<ng-content>`:

```html
<div class="header-area">
  <ng-content select="h1" />
</div>
```

This tells Angular to project any `<h1>` elements from the parent into the header area. The remaining (unmatched) content still goes into the default `<ng-content />` in the content area.

### Step 5
Verify the application: each expander should now show the `<h1>` text in the header area and the rest of the content in the body.

---

## Phase 3 - Select by attribute

### Step 6
Using an element name like `h1` as a selector is **not ideal**:
- It forces consumers to use a specific HTML tag, which may conflict with the page's semantic structure (e.g., multiple `<h1>` elements on a page is bad for accessibility and SEO).
- It is fragile - if a consumer puts an `<h1>` in the body content, it would accidentally get projected into the header.

A better approach is to select by a **custom attribute**. Update the `<ng-content>` in the header area to select by attribute instead:

```html
<div class="header-area">
  <ng-content select="[expander-header]" />
</div>
```

### Step 7
In `app.html`, replace each `<h1>` with a `<span>` that carries the `expander-header` attribute. Also add an `<app-icon>` component inside the span to display an icon next to the header text. Import the `Icon` component in the `AppComponent` if needed.

The final markup for each expander should look like this:

```html
<app-expander>
  <span expander-header>
    <app-icon class="header-icon" name="projection" />What is Content Projection?
  </span>
  <!-- ...rest of the body content... -->
</app-expander>
```

Use the following icon names for the three expanders: `projection`, `cogwheel`, and `modularity`.

### Step 8
Verify that the application works as expected: each expander should display the icon and header text in the header area, and the rich body content in the content area. Expand/collapse should still work correctly.
