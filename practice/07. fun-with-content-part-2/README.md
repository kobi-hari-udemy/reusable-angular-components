# Practice 6 - Fun with Content

In this exercise we will build a reusable `ExpanderComponent` that receives a header and content as inputs and displays them in a styled expandable panel with a toggle button.

The template (`app.html`) already renders three `<app-expander>` instances with `header` and `content` attribute bindings. The expander component (`components/expander/`) has a styled shell with three grid areas (`header-area`, `toggle-area`, `content-area`) but no inputs or logic yet.

### Step 1
Add `header` and `content` string inputs to the `ExpanderComponent`.

### Step 2
Display the `header` input inside the `.header-area` div and the `content` input inside the `.content-area` div in `expander.html`.

### Step 3
Add an `isExpanded` boolean signal to the component (default `true`) and a `toggle()` method that flips its value.

### Step 4
Place a button inside the `.toggle-area` div that calls `toggle()` on click. The button should display `−` when expanded and `+` when collapsed.

### Step 5
When the expander is collapsed, set the second grid row of the host element to `0fr` instead of `1fr`. This will smoothly collapse the content area while keeping the header visible.

#### Hints:
- Use a host binding to conditionally set a CSS class (e.g., `collapsed`) on the host element based on the `isExpanded` signal.
- In the component's SCSS, the host element uses `grid-template-rows: min-content 1fr`. Add a `:host.collapsed` rule that changes the second row to `0fr`.
- The `.content-area` already has `overflow: hidden` applied via the styles, so the content will be clipped as the row shrinks.
- Also set `padding-block: 0` on the `.content-area` when collapsed, otherwise the padding will prevent the content area from fully disappearing.

### Step 6
Verify that the application works as expected: each expander displays its header and content, and clicking the toggle button expands or collapses the content area.
