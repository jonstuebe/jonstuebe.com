---
title: Tailwind & Scrollbars
summary: >-
  While building this site I wanted to customize the scrollbars with css and hoped I could use some tailwindcss classes to do so. I found one plugin but it didn't seem to support dark mode, plus there was a couple of other things I wanted to add. So, I built it.
date: "2021-01-18T22:44:07.098Z"
image: https://source.unsplash.com/G9js7s793k4/3450x2300
---

While building this site I wanted to customize the scrollbars with css and hoped I could use some [`tailwindcss`](https://tailwindcss.com/) classes to do so. I found one plugin but it didn't seem to support dark mode, plus there was a couple of other things I wanted to add. So, I built it.

## Installation

Install the plugin from npm

```bash
# Using npm
npm install tailwindcss-scrollbar

# Using yarn
yarn add tailwindcss-scrollbar
```

Then add the plugin to your `tailwind.config.js` file:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require("tailwindcss-scrollbar"),
    // ...
  ],
};
```

## Usage

Now you can use the utility classes to add your custom scrollbar to any html/jsx:

```html
<!-- html -->
<html class="overflow-y-scroll">
  ...
  <body class="scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-200">
    ...
  </body>
</html>
```

```jsx
{/* Next.js _document.js */}
<Html class="overflow-y-scroll">
  ...
  <body class="scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-200">
  ...
```

### Width modifiers

Width modifiers allow you to adjust the width of the scrollbar. This follows the values from `theme.spacing`.

```html
<!-- html -->
<html class="overflow-y-scroll">
  ...
  <body class="scrollbar-w-1 scrollbar-thumb-gray-400 scrollbar-track-gray-200">
    ...
  </body>
</html>
```

### Color modifiers

Both the `thumb` and `track` have color modifiers based off of `theme.colors` (see above examples).

### Variants

If you want to add other variants such as `dark`, `responsive`, etc, add them to your config like so:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require("tailwindcss-scrollbar"),
    // ...
  ],
  variants: {
    scrollbar: ["dark"],
    // ...
  },
};
```
