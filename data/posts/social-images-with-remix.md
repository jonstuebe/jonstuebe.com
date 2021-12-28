---
title: Social Images With Remix
date: "2021-12-28T16:07:02.733Z"
image: https://source.unsplash.com/EQSPI11rf68/2834x1591
---

## How does it work?

If you're not familiar the overall process starts with a serverless function that runs a browser using something like `puppeteer` and takes a screenshot of the content and then sends that screenshot as the response for the serverless function.

A few of the guides used some `puppeteer` abstraction libraries that looked really nice but only worked on my local and had alot of issues when deployed to vercel (I'm assuming because of the `puppeteer` configuration). So, I decided to just get as bare bones as possible and use `puppeteer` directly.

So for starters you'll want to create a new "resource" route. In [Remix](https://remix.run/) this is basically just a route that doesn't export a `default` function but instead simply exports a `LoaderFunction`.

## Install

First we'll install our `devDependencies` so that we can see this all functioning on our local machine.

```shell
yarn add --dev puppeteer
```

Next we'll install the `dependencies` to be used in production.

```shell
yarn add puppeteer-core chrome-aws-lambda
```

## Loader

In your loader you'll want to some code so that your app knows which version of `puppeteer` to use:

```typescript
export const loader: LoaderFunction = async ({ request, params }) => {
  let chrome: any = { args: [] };
  let puppeteer;

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    chrome = require("chrome-aws-lambda");
    puppeteer = require("puppeteer-core");
  } else {
    puppeteer = require("puppeteer");
  }
  ...
}
```

Now that you have `puppeteer` ready to go, it's time to actually launch the browser, render content, and take the screenshot.

First let's launch the browser and set the viewport.

```typescript
const browser = await puppeteer.launch({
  args: [...chrome.args, "--hide-scrollbars"],
  executablePath: chrome ? await chrome.executablePath : undefined,
});
const page = await browser.newPage();
// configure viewport
await page.setViewport({
  width: 1920,
  height: 1007,
  deviceScaleFactor: 1,
});
```

Next let's render our react component and then setup our html for the page. Note that you also need to include your css for your styles and fonts.

```typescript

import { renderToString } from "react-dom/server";
import { SocialCard } from "~/components/SocialCard";

...
// post is loaded somewhere else in the loader function
const html = renderToString(
  <SocialCard
    title={post.title}
    image={post.image}
    readingTime={post.readingTime}
  />
);

await page.setContent(
  `<html class="font-sans"><head><link href="https://cdnjs.cloudflare.com/ajax/libs/inter-ui/3.19.3/inter.min.css" rel="stylesheet" /><link href="${css}" rel="stylesheet" /></head><body>${html}</body></html>`,
  {
    waitUntil: "networkidle0",
  }
);
```

Finally we take our screenshot and return our response with the correct `Content-Type` for a `jpeg`.

```typescript
const screenshot = await page.screenshot({ type: "jpeg", quality: 100 });

return new Response(screenshot, {
  headers: {
    "Content-Type": "image/jpeg",
  },
});
```

Hopefully that helps you get off to a great start generating dynamic social images with Remix. As always hit me up on twitter if you have any questions.
