# Practice 3 - Tracking the mouse with Directives
 
In this exercise we will create a directive that tracks the mouse position and helps to visualize it in various ways: both by moving another element relative to the mouse position, and by changing the visual aspects of an element based on the mouse position.

### Step 1
Add a new directive called `TrackMouse` to your Angular application. This directive will be responsible for tracking the mouse position.

### Step 2 
Apply the new directive on the "field" div. This div will serve as the area where we track the mouse movement.

### Step 3
Implement the logic in the `TrackMouse` directive to listen for mouse movement events and update the value of `x` and `y` signals with the current mouse coordinates.

#### Hints: 
- Inject the host element and use `getBoundingClientRect()` to get the host element position and dimensions. This will help you calculate the mouse position relative to the host element.
- Listen to the `mousemove` event on the host element to track the mouse movement. Use the event payload, and specifically the `clientX` and `clientY` properties, to get the mouse coordinates.
  
### Step 4
In the first `field` div, there is a child element - a div with the class `ball`. It is positioned absolutely within the "field" div. Use the `x` and `y` signals to update the position of the `ball` div so that it follows the mouse cursor as it moves around the `field` div.

Hints: 
- Use the `style` binding to set the `left` and `top` CSS properties of the "ball" div based on the `x` and `y` signals. This will allow the "ball" to move in sync with the mouse cursor.
- Use `exportAs` in the directive to make the `x` and `y` signals available for binding in the template.
- Remember to account for the size of the "ball" div when positioning it, so that it centers around the mouse cursor.

### Step 5
In the second "field" div, use the `x` and `y` signals to change the background of the div based on the mouse position. Create a radial gradient that changes its center based on the mouse position, creating a spotlight effect that follows the cursor.

Hints: 
- In the directive, create custom css properties (e.g., `--mouse-x` and `--mouse-y`) that are updated with the current mouse coordinates. This allows you to use these properties in your CSS to create dynamic styles based on the mouse position.
- In the scss file, create a radial gradient background for the second "field" div.
- radial gradient can center around an explicit center position by using the following syntax: 
```scss
radial-gradient(circle at 10px 20px, color1, color2)`
```
- Instead of `10px` and `20px` Use the custom css properties you created in the directive to set these coordinates dynamically based on the mouse position.