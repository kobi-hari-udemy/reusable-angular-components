# Practice 2 - Fun With Directives
 
In this exercise we will add "active" state to our highlight directive, and we will use Host Bindings and Listeners to achieve that.

1. Add an `isActive` writeable signal to the directive, and set it to `false` by default.
2. Add a `toggleActive` method to the directive, that will toggle the value of `isActive`.
3. Add a host listener for the `click` event, that will call the `toggleActive` method.
4. Add a `bg` computed signal that will return the background color based on the value of `isActive`. If `isActive` is `true`, return  `pink`. otherwise return the value of the `color` input, or `lime` if the `color` input is not set.
