# Practice 5 - Fun With Selectors

In this practice we will explore the power of directive and component **selectors** in Angular. We will create directives that target specific elements using attribute and element type selectors, and we will also experiment with using a standard HTML element as a component selector.

The template (`app.html`) is already set up with an image gallery, a form with various input fields, and a row of buttons. Your job is to create the directives and components that make it all come together.

## Challenge 1 - Capitalize Directive

Create a directive that **capitalizes the content** of text inputs after the user leaves the field (on `blur`).

### Step 1
Create a new directive called `Capitalize` in `directives/capitalize.directive.ts`. Use a **compound selector** that targets only `<input>` elements of `type="text"` that also have the `capitals` attribute:
```
input[type="text"][capitals]
```

### Step 2
Add a host listener for the `blur` event. In the event handler, read the current value of the input, capitalize each word, and write the result back to the input.

#### Hints:
- Use the `host` property in the `@Directive` decorator to bind the `(blur)` event.
- The event payload (`$event`) gives you access to the `target` element, which you can cast to `HTMLInputElement` to read and write its `value`.
- A helper function `capitalizeWords` is already provided in `utils/string.utils.ts` — use it to capitalize the words.
- Use `inject(Renderer2)` and its `setProperty` method to write the value back to the input.


### Step 3
Import the `Capitalize` directive in the `App` component's `imports` array. Verify that typing a lowercase name in the "First Name" or "Last Name" fields and then tabbing out capitalizes each word.

---

## Challenge 2 - Image Tooltip from Alt

Create a directive that automatically sets the **tooltip** (`title` attribute) of an image by copying the value from its `alt` attribute.

### Step 1
Create a new directive called `ImageAlt` in `directives/image-alt.directive.ts`. Use a compound selector that targets `<img>` elements that have **both** an `alt` attribute and a `tooltip` attribute:
```
img[alt][tooltip]
```

### Step 2
Declare an `input()` called `alt` to read the value of the `alt` attribute from the host element. Then use a host binding to set the `title` attribute to the value of `alt`.

#### Hints:
- Use the `host` property in the `@Directive` decorator to add `'[attr.title]': 'alt()'`.
- The `alt` input will automatically receive the value of the `alt` attribute from the host element because they share the same name.

### Step 3
Import the `ImageAlt` directive in the `App` component's `imports` array. Hover over the first image in the gallery (the one with the `tooltip` attribute) to see the tooltip. Notice that the other images do **not** get the tooltip because they lack the `tooltip` attribute.

---

## Challenge 3 - The Crazy Button Experiment 🤪

This is a fun experiment to see what happens when you create a **component** whose selector is a standard HTML element - in this case, `button`.

### Step 1
Create a new component called `CrazyButton` in `components/crazy-button.component.ts`. Set its **selector** to just `button`.

### Step 2
In the component's template, just write something fun like:
```html
CRAZY
```

### Step 3
Add a host binding that sets a visible border style (e.g., `1px solid var(--color-secondary)`) so you can see the effect.

### Step 4
Import the `CrazyButton` component in the `App` component's `imports` array. Look at the buttons in the page — every `<button>` element now uses your custom component template! Notice that the original button text ("Save", "Cancel", "Reset") is gone — replaced entirely by "CRAZY".

### Step 5
Now update the component's template to use `<ng-content/>` wrapped in some fun characters:
```html
!!  <ng-content/>  !!
```

The `<ng-content/>` element is a **content projection slot**. It tells Angular: "take whatever content was placed _inside_ the host element in the parent template, and render it here." So for a button like `<button>Save</button>`, the word "Save" is projected into the slot, and the final rendered output becomes `!! Save !!`.

Check the buttons again - they should now display their original text, but surrounded by `!!` on each side.

### Things to Notice
- Angular completely replaces the inner content of the host element with the component's template.
- With `<ng-content/>`, the original content is **projected** into the template, allowing you to wrap or decorate it while preserving it.
- This technique is **not recommended** for production - it can cause unexpected side effects - but it's a great way to understand how Angular's selector matching and content projection work under the hood.
