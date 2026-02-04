# CAOS - Comibyte Animate On Scroll

A lightweight, performant, and dependency-free JavaScript library for animating elements on scroll. CAOS uses the modern `IntersectionObserver` API for optimal performance, ensuring smooth animations without bogging down your main thread.

### Key Features

* **Performant:** Uses `IntersectionObserver` to efficiently detect when elements enter the viewport.
* **Zero Dependencies:** Written in pure vanilla JavaScript. No jQuery or other libraries required.
* **Customizable:** Easily change animation duration, delay, and trigger points through HTML data attributes.
* **Variety of Animations:** Includes fades, slides, zooms, flips, and more.
* **Special Effects:** Built-in support for modern overlay reveals and parallax background effects.
* **Repeatable or Once-Off:** Configure animations to run once or every time an element enters the viewport.

---

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Available Animations](#available-animations)
* [Customization Attributes](#customization-attributes)
* [Special Effects](#special-effects)
    * [Overlay Effect](#overlay-effect)
    * [Parallax Effect](#parallax-effect)
* [Advanced Configuration (JavaScript)](#advanced-configuration-javascript)
* [License](#license)

---

## Installation

Getting started with CAOS is simple. download the caos folder and link its CSS and JavaScript to your HTML file.

1.  **Link the CSS:** Link the CAOS CSS style within the `<head>` of your HTML.

    ```html
    <link rel="stylesheet" href="path/to/the/file/caos.css">
    ```

2.  **Link the JavaScript:** Link the CAOS JavaScript file just before the closing `</body>` tag.

    ```html
    <!-- Before your closing </body> tag -->
    <script src="path/to/the/folder/caos.js"></script>
    ```

That's it! The library is now active and will automatically detect and animate any elements with the `data-caos` attribute.

---

## Usage

To animate an element, simply add the `data-caos` attribute to it with the desired animation type.

```html
<!-- This div will fade in from the bottom when it scrolls into view -->
<div data-c aos="fade-up">
  <h2>Hello, World!</h2>
  <p>This content is now animated.</p>
</div>
```

---

## Available Animations

Here is a list of all the animation types you can use with `data-caos`:

| Animation Type         | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| `fade-up`              | Fades and moves up from the bottom.                  |
| `fade-down`            | Fades and moves down from the top.                   |
| `fade-left`            | Fades and moves in from the left.                    |
| `fade-right`           | Fades and moves in from the right.                   |
| `fade-down-left`       | Fades and moves in from the down-left.               |
| `fade-down-right`      | Fades and moves in from the down-right.              |
| `fade-up-left`         | Fades and moves in from the up-left.                 |
| `fade-up-right`        | Fades and moves in from the up-right.                |
| `fade-zoom`            | Fades and zooms in.                                  |
| `fade-zoom-left`       | Fades and zooms in from the left.                    |
| `fade-zoom-right`      | Fades and zooms in from the right.                   |
| `fade-zoom-up-right`   | Fades and zooms in from the top-right.               |
| `fade-zoom-up-left`    | Fades and zooms in from the top-left.                |
| `fade-zoom-down-left`  | Fades and zooms in from the bottom-left.             |
| `fade-zoom-down-right` | Fades and zooms in from the bottom-right.            |
| `fade-spin-left`       | Fades and spins in from the left.                    |
| `fade-spin-right`      | Fades and spins in from the right.                   |
| `slide-up`             | Slides in from completely below the element.         |
| `slide-down`           | Slides in from completely above the element.         |
| `slide-left`           | Slides in from completely to the left.               |
| `slide-right`          | Slides in from completely to the right.              |
| `zoom-in`              | Zooms in from a smaller size.                        |
| `zoom-out`             | Zooms out from a larger size.                        |
| `zoom`                 | Performs a default zoom animation.                   |
| `zoom-left`            | Zooms in from the left.                              |
| `zoom-right`           | Zooms in from the right.                             |
| `zoom-up`              | Zooms in from the top.                               |
| `zoom-down`            | Zooms in from the bottom.                            |
| `spin-right`           | Spins clockwise from the right.                      |
| `spin-left`            | Spins counter-clockwise from the left.               |
| `spin-up`              | Spins upward around the X-axis.                      |
| `spin-down`            | Spins downward around the X-axis.                    |
| `spin-down-left`       | Spins in from the bottom-left corner.                |
| `spin-down-right`      | Spins in from the bottom-right corner.               |
| `spin-up-left`         | Spins in from the top-left corner.                   |
| `spin-up-right`        | Spins in from the top-right corner.                  |
| `spin-zoom`            | Spins while zooming in.                              |
| `flip-up`              | Flips in over the X-axis from the bottom.            |
| `flip-down`            | Flips in over the X-axis from the top.               |
| `flip-left`            | Flips in over the Y-axis from the left.              |
| `flip-right`           | Flips in over the Y-axis from the right.             |
| `overlay-reveal-right` | Reveals content with an overlay moving to the right. |
| `overlay-reveal-left`  | Reveals content with an overlay moving to the left.  |
| `parallax`             | Applies a parallax effect to a background.           |
| `blur`                 | Blurs in the element.                                |
| `blur-spin-right`      | Blurs and spins in from the right.                   |
| `blur-spin-left`       | Blurs and spins in from the left.                    |
| `blur-zoom`            | Blurs and zooms in.                                  |


## Customization Attributes

You can easily customize the behavior of each animation directly from your HTML using these data attributes:

* `data-caos-duration`: Sets the duration of the animation in milliseconds.
    * **Example:** `data-caos-duration="1500"` (for a 1.5-second animation).

* `data-caos-delay`: Adds a delay before the animation starts, in milliseconds.
    * **Example:** `data-caos-delay="500"` (waits 0.5 seconds before starting).

* `data-caos-once`: Overrides the global setting to make a specific animation run only once.
    * **Example:** `data-caos-once="true"`

* `data-caos-overlay-color`: Sets the background color for the overlay reveal effect.
    * **Example:** `data-caos-overlay-color="#ff6347"`

**Combined Example:**

```html
<div data-caos="fade-left" data-caos-duration="1000" data-caos-delay="300">
  This element fades in from the left over 1 second after a 300ms delay.
</div>
```

---

## Special Effects

### Overlay Effect

The overlay effect requires a specific HTML structure. The element with the `data-caos` attribute acts as a container, and it must contain a `div` with the class `caos-overlay`.

```html
<!-- Container with the animation attribute -->
<div class="caos-overlay-container" data-caos="overlay-reveal-right" data-caos-overlay-color="var(--primary-color)">
<!-- <div class="caos-overlay-container" data-caos="overlay-reveal-right" data-caos-overlay-color="Your Prefered Overlay color"> -->
  <!-- The actual overlay element -->
  <div class="caos-overlay"></div>
  
  <!-- Your content to be revealed -->
  <h1>Revealed Content</h1>
</div>
```

### Parallax Effect

The parallax effect also requires a specific structure. The `data-caos="parallax"` container holds a background element and a content element.

```html
<!-- Container with the parallax attribute -->
<div class="caos-parallax-container" data-caos="parallax">
  <!-- The background element that will move -->
  <div class="caos-parallax-bg" style="background-image: url('path/to/your/image.jpg');"></div>
  
  <!-- Your foreground content -->
  <div class="caos-parallax-content">
    <h2>Parallax Title</h2>
  </div>
</div>
```

The background image moves at a different speed than the page scroll, creating a sense of depth.

---

## Advanced Configuration (JavaScript)

You can change the global behavior of CAOS by passing an options object to the `init()` function.

```javascript
CAOS.init({
  // How much of the element should be visible before animating (0 to 1.0)
  // Default is 0.5 (50%)
  threshold: 0.75, 

  // Whether animations should only happen once globally.
  // Default is false. Can be overridden per-element with data-caos-once.
  once: true 
});
```

### Options

* **`threshold`**: (Number | Default: `0.5`) A value between `0.0` and `1.0` that determines what percentage of the element must be visible on screen before the animation is triggered. `0.25` means 25% visible.
* **`once`**: (Boolean | Default: `false`) If set to `true`, all animations on the page will only run one time.
#
