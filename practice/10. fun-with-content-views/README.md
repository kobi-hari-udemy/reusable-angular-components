# Practice 10 - View Encapsulation & Styling Components

In this exercise we will explore **view encapsulation** in Angular and learn how to effectively style reusable components using CSS custom properties, the `:host` selector, `host-context`, and `::ng-deep`. We will investigate how Angular applies special attributes to manage style isolation, use CSS custom properties to create themeable components, and understand best practices for styling projected content.

---

## Task 1 - Understand View Encapsulation through DevTools Investigation

### Step 1
Open the application in a browser and open the **F12 Developer Tools**. In the Elements/Inspector tab, examine the DOM tree of the `ExpanderComponent` and its content.

**Observe the following:**
- Look for **special attributes** on elements that Angular has added (e.g., `_nghost-ng-c###`, `_ngcontent-ng-c###`).
- These attributes are automatically applied by Angular to isolate view encapsulation.
- Inspect elements that are part of the component's view (template) vs. elements that are **projected content** (passed via `<ng-content>`).
- Notice how the attributes differ between the component's own elements and the projected content.

### Step 2
Write down or note in comments what you observe:
- Which elements have `_nghost-*` attributes? (These mark the **view host** — the component boundary)
- Which elements have `_ngcontent-*` attributes? (These mark content within that view context)
- What happens to projected content? (Does it have different attributes?)
- How does this relate to **CSS scope isolation**?

This investigation helps you understand how Angular ensures that component styles don't leak out and external styles don't unexpectedly leak in.

### Step 3
Now open the **Head** section of the page in DevTools and look for `<style>` elements. You should see **multiple `<style>` elements** — one for each component or global style. This is different from how styles were bundled before Angular's view encapsulation.

**Observe:**
- How many `<style>` elements do you see?
- Which one is the global stylesheet?
- Which ones correspond to the `ExpanderComponent` and other components you're using?

### Step 4
Find the `<style>` element corresponding to the `ExpanderComponent`. Examine the CSS rules inside it. You should see rules like:

```css
:host[_nghost-ng-c###] {
  ...
}

.header-area[_ngcontent-ng-c###] {
  ...
}  
```

Notice two important transformations that have been applied:

### Step 5
**SCSS Compiler Changes** — Look for evidence that the **SCSS was compiled to CSS**:
- Nested selectors have been **flattened** (e.g., `.header { &:hover { ... } }` becomes separate `.header` and `.header:hover` rules).

### Step 6
**Angular Compiler Changes** — Look for evidence that **Angular has modified the CSS for view encapsulation**:
- The original `:host` selector has been transformed to `[_nghost-ng-c###]` or a similar attribute selector.
- Selectors like `.header-area` have been appended with `[_ngcontent-ng-c###]` to scope them to this component's view.
- These special attributes (`_nghost-*` and `_ngcontent-*`) are Angular's way of enforcing style isolation — they ensure that styles from this component only apply to elements within this component.

### Step 7
Compare the `<style>` elements of **different components** (e.g., ExpanderComponent and AppComponent or Icon component if you have one). Notice that:
- Each component has its **own unique number** in the attribute (e.g., `ng-c123` vs `ng-c124`).
- This unique identifier is specific to each component, ensuring styles don't collide.
- Styles from one component's `<style>` element only apply to elements marked with that component's attribute.

---

## Task 2 - Use the `:host` Selector and `host-context()`

### Step 8
In the `ExpanderComponent` SCSS file, notice the **`:host`** selector to style the component container itself:

```scss
:host {
  display: grid;
  border-radius: 10px;
  ...
}
```

Open DevTools and **inspect the generated CSS rule**. Notice:
- The `:host` selector is translated by Angular to a rule targeting the `_nghost-*` attribute.
- This ensures the style only applies to this specific component instance.

### Step 9
Experiment with the `:host` selector:
- Use `:host.active` to style the component when it has an `active` class.
- Use `:host([attr-name])` to style based on component attributes.
- Observe how these translated to CSS attribute selectors in DevTools.

### Step 10
In the `ExpanderComponent` SCSS, use **`host-context()`** to style the component differently based on its **parent context**:

```scss
:host-context(.grayscale) {
    --expander-primary: rgb(75, 75, 75);
}
```

In `app.html`, wrap an expander in a `<div class="grayscale">` and observe:
- The `host-context()` selector is translated to a descendant combinator rule.
- The component adapts its style based on the surrounding context.

---

## Task 3 - Use CSS Custom Properties for Component Customization

### Step 11
Notice how we Define **public custom properties** in the `:host` block. Now we will change it so that we have 2 sets. One of public custom properties that consumers can override, and another set of private custom properties that are used internally in the component and have sensible defaults:

```scss
:host {
  /* Public properties */
  --v-expander-border-color: var(--expander-border-color, #ccc);
  --v-expander-bg-color: var(--expander-bg-color, #fff);
  --v-expander-text-color: var(--expander-text-color, #333);
  --v-expander-padding: var(--expander-padding, 16px);  
}
```

This way, consumers can set `--expander-border-color`, `--expander-bg-color`, etc. on the component element, and if they don't, the component will fall back to the default values defined in the private properties.

### Step 12
Use these **private** custom properties throughout the component's SCSS:

```scss
:host {
  display: block;
  border: 1px solid var(--v-expander-border-color);
  background-color: var(--v-expander-bg-color);
  color: var(--v-expander-text-color);
  padding: var(--v-expander-padding);
}
```


### Step 14
In `app.html`, consumer can now customize the component by setting custom properties on the component element:

```html
<app-expander class="special">
  <span expander-header>Custom Styled Expander</span>
  <p>This expander has custom colors and padding set via CSS custom properties.</p>
</app-expander>

```scss
.special {
  --expander-border-color: #007bff;
  --expander-bg-color: #e9f5ff;
  --expander-text-color: #0056b3;
  --expander-padding: 24px;
}

```

Verify that the styling changes without touching the component's SCSS.

---

## Task 4 - Use a Primary Color Token with Derived Colors

### Step 15
Define a **primary color token** in the component's `:host`:

```scss
:host {
  --expander-primary-color: #007bff;
  
  // Derive secondary colors from the primary
  --v-expander-primary-light: color-mix(in srgb, var(--expander-primary-color) 80%, white);
  --v-expander-primary-dark: color-mix(in srgb, var(--expander-primary-color) 80%, black);
}
```

### Step 16
Create more specific public custom properties that **default to derived colors** but can be overridden:

```scss
:host {
  --expander-primary-color: #007bff;
  
  // Derived private colors
  --v-expander-primary-light: color-mix(in srgb, var(--expander-primary-color) 80%, white);
  --v-expander-primary-dark: color-mix(in srgb, var(--expander-primary-color) 80%, black);

  // Private properties that fallback to derived colors
  --v-expander-background-color: var(--expander-background-color, var(--v-expander-primary-light));
  --v-expander-hover-color: var(--expander-hover-color, var(--v-expander-primary-dark));
  --v-expander-highlight-color: var(--expander-highlight-color, var(--v-expander-primary-color));
}
```

### Step 17
Use these properties in the component styles:

```scss
.header {
  background-color: var(--v-expander-background-color);
  
  &:hover {
    background-color: var(--v-expander-hover-color);
  }
}

.toggle-area button {
  color: var(--v-expander-highlight-color);
}
```

### Step 18
Consumers can now:
- Change only the primary color and see all derived colors update automatically.
- Or override specific accent/hover/highlight colors for fine-grained control.

Test both scenarios in `app.html`.

---

## Task 5 - Use Custom Properties for Animation Timing

### Step 19
Define a custom property for animation timing:

```scss
:host {
  --v-expander-animation-duration: var(--expander-animation-duration, 300ms);
}
```

### Step 20
Apply it to animations and transitions in the component:

```scss
:host {
  ...
  transition: grid-template-rows var(--v-expander-animation-duration);
}
```

---

## Task 6 - Style Projected Content Using `::ng-deep`

### Step 22
By default, styles in the component's SCSS do **not** apply to **projected content** (due to view encapsulation). To style elements inside the projected content, use **`::ng-deep`**:

```scss
:host ::ng-deep h2 {
  color: var(--expander-primary-color);
  font-size: 1.2em;
  margin-top: 0;
}

:host ::ng-deep p {
  line-height: 1.6;
  color: var(--expander-text-color);
}

:host ::ng-deep strong {
  color: var(--expander-highlight-color);
  font-weight: 600;
}
```

### Step 23
In `app.html`, place `<h2>`, `<p>`, and `<strong>` tags inside the expander content:

```html
<app-expander>
  <span expander-header>Header Text</span>
  <h2>Title</h2>
  <p>This is sample content with <strong>important text</strong>.</p>
</app-expander>
```

Verify that the `h2`, `p`, and `strong` elements are styled according to the rules you defined, **but only inside this component**. (They should not be styled if they appear elsewhere in the app.)

---

## Task 7 - Move Global Toggle Button Styles to Component Using `::ng-deep`

### Step 24
If you have global styles for the toggle button (in `global.scss` or `style.scss`), move those rules into the `ExpanderComponent` SCSS using `::ng-deep` **inside** `:host`:

**Before (in global styles):**
```scss
.toggle-area button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  padding: 8px 12px;
}
```

**After (in expander.component.scss):**
```scss
:host ::ng-deep .toggle-area button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  padding: 8px 12px;
}
