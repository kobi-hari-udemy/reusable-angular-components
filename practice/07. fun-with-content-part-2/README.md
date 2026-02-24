# Practice 7 - Fun with Content (Part 2)

In this exercise we will refactor the `ExpanderComponent` to use **content projection** via `<ng-content>` instead of receiving the body content through a string input.

The component (`components/expander/`) already has a working expander with a `header` input, a toggle button, and expand/collapse logic. However, the body content is still passed as a plain-text `content` string input and rendered with interpolation (`{{ content() }}`). The parent template (`app.html`) has already been updated to pass **rich HTML content** (headings, paragraphs, bold text) as children of each `<app-expander>` element — but it is not being projected yet.

### Step 1
Remove the `content` string input from the `ExpanderComponent`.

### Step 2
In `expander.html`, replace the `{{ content() }}` interpolation inside the `.content-area` div with an `<ng-content>` element so that the child content provided by the parent is projected into the content area.

### Step 3
Verify that the application works as expected: each expander should now display the **rich HTML content** (headings, paragraphs, bold text) projected from the parent, and clicking the toggle button should still expand or collapse the content area.

#### Hints:
- `<ng-content>` acts as a placeholder that Angular replaces with the content placed between the component's opening and closing tags.
