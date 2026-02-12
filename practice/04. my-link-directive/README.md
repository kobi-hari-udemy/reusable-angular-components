# Practice 4 - Directive Composition with `hostDirectives`

In this exercise we will create a custom `MyLink` directive that uses Angular's **Directive Composition API** (`hostDirectives`) to compose `RouterLink` and `RouterLinkActive` into a single, reusable directive. This will simplify the template by replacing two separate directive bindings with one.

### Step 1
Create a new directive called `MyLink` in a new file (e.g., `directives/my-link.directive.ts`). Use `[myLink]` as the selector.

### Step 2
Use the `hostDirectives` property in the `@Directive` decorator to compose `RouterLink` as a host directive. Expose its `routerLink` input and alias it to `myLink`, so consumers can write `myLink="page-a"` instead of `routerLink="page-a"`.

#### Hints:
- The `hostDirectives` property takes an array of directive configurations.
- Each configuration can specify `inputs` and `outputs` arrays to expose bindings from the host directive.
- Use the `'routerLink: myLink'` syntax inside the `inputs` array to alias the `routerLink` input to `myLink`.

### Step 3
Add `RouterLinkActive` as a second host directive in the `hostDirectives` array. This will allow the directive to automatically track whether the associated route is active.

#### Hints:
- You do **not** need to expose any inputs or outputs from `RouterLinkActive` if you plan to set a default active class inside the directive (see Step 4).

### Step 4
Inside the directive class, inject `RouterLinkActive` and set a default active CSS class (e.g., `'selected'`), so consumers don't have to specify it every time.

#### Hints:
- Use `inject(RouterLinkActive)` to get a reference to the composed `RouterLinkActive` instance.
- Set its `routerLinkActive` property to `'selected'` (or your preferred class name) inside the constructor or an initialization block.

### Step 5
Update the `app.html` template to use the new `MyLink` directive. Replace the existing `routerLink` and `routerLinkActive` bindings on each `<a>` tag with a single `myLink` binding.

#### Hints:
- Before: `<a routerLink="page-a" routerLinkActive="selected">Page A</a>`
- After: `<a myLink="page-a">Page A</a>`
- Don't forget to import `MyLink` in the component's `imports` array, and remove `RouterLink` and `RouterLinkActive` if they are no longer used directly.

### Step 6
Verify that the application still works as expected: clicking a nav link should navigate to the corresponding page, and the active link should have the `selected` class applied automatically.

## Challange - Allow to Customize the Active Class
Since we dont want the user to have to repeat the same class name for every link, we will allow to customize it using Dependency Injection. We will define a new Injection Token called `MY_LINK_ACTIVE_CLASS` and use it to provide a default active class name. Consumers can override this token to specify a different class name if desired.

### Step 7
- Define a new Injection Token called `MY_LINK_ACTIVE_CLASS` in the same file as the directive. 
- Define also a provider function `provideMyLinkActiveClass` that allows users to easily provide a custom active class name. 

### Step 8
Use the `inject` function to get the value of `MY_LINK_ACTIVE_CLASS` in the directive's constructor, and set it as the active class for `RouterLinkActive`. Make this an optional injection with a default value of `'selected'`.

### Step 9 - Try it
In the App Component, use the `provideMyLinkActiveClass` function to set a custom active class name (e.g., `'active-link'`). Verify that the new class is applied to active links instead of the default `'selected'` class.


