---
title: SSR & Code Syntax Highlighting
summary: >-
  In the past I've had to use a few different code syntax highlighters. Most of them have the same core principles
date: "2021-01-17T22:22:32.601Z"
image: https://source.unsplash.com/SyYmXSDnJ54/2550x1700
---

In the past I've had to use a few different code syntax highlighters. Most of them have the same core principles:

1. Take the markup and tokenize the string (strings, method names, etc).
1. Each token gets a specific style based on the theme (usually this done through inline styles).

One of the issues I have with syntax highlighters is that all this usually happens on the client side which really stinks. The page has to wait for js to init, and then all of the computations and painting has to happen. There is a serious delay that happens and that's no bueno. More than that, the whole page is going to shift which has a few bad implications. One, Google has started docking you points for having any layout shift after the initial painting has begun. This usually applies to things like images, but also affects things like code blocks too.

Anyways, I wanted to figure out a way to have all of this render via SSR. With Next.js that becomes real easy. However, there's a couple of gotcha's that I want to talk about.

### Dark Mode

With dark mode, you have to keep in mind that now your code blocks need two themes. One for light mode and one for dark. We could rely on inline styles or css-in-js but that starts to get complicated. I'm using [tailwind](https://tailwindcss.com/) for my site, so I decided to turn of all css-in-js/inline styles functions on my syntax highlighter and have it simply add classnames to all of the tokens.

### Tailwind Integration

I was hoping for a way to use their existing styles or possibly augment them with a theme that I liked. All my blog markdown gets converted to html using `remark` so I use the `@tailwindcss/typography` package to style all of my content using the `prose` classname (If you're curious how that works [check this out](https://github.com/tailwindlabs/tailwindcss-typography)).

I mention this because with the typography plugin in place, it allows me to extend and target css selectors like `pre code` and others that have to do with styling my code blocks. With that I went and picked out a code syntax theme that had both a light/dark mode that I liked and simply grabbed the raw css and dropped it into my tailwind stylesheet.

Here's the styles:

```css
.light code .token {
  &.atrule {
    color: #7c4dff;
  }
  &.attr-name {
    color: #39adb5;
  }
  &.attr-value {
    color: #f6a434;
  }
  &.attribute {
    color: #f6a434;
  }
  &.boolean {
    color: #7c4dff;
  }
  ...
}

.dark code .token {
  &.atrule {
    color: #c792ea;
  }
  &.attr-name {
    color: #ffcb6b;
  }
  &.attr-value {
    color: #a5e844;
  }
  &.attribute {
    color: #a5e844;
  }
  &.boolean {
    color: #c792ea;
  }
  ...
}
```

With that I had nice light/dark mode themed code blocks that were server side rendered with Next.js. If you have any questions about my site, feel free to check it out on [github](https://github.com/jonstuebe/jonstuebe.com) or hit me up on [twitter](https://twitter.com/jonstuebe).
