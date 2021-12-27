import { promises as fs } from "fs";
import path from "path";
import chromium from "chrome-aws-lambda";
import { renderToString } from "react-dom/server";
import type { HeadersFunction, LoaderFunction } from "remix";

import { SocialCard } from "~/components/SocialCard";

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control") ?? "max-age=604800",
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const createClient = (await import("redis")).createClient;
    const client = createClient({
      url: process.env.REDIS_URL,
    });

    await client.connect();

    const post = await client.hGetAll(`post:${params.slug}`);
    await client.disconnect();

    const browser = await chromium.puppeteer.launch({});
    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    const html = renderToString(
      <SocialCard title={post.title} image={post.image}>
        <h3 className="absolute m-0 p-0 text-6xl text-white opacity-80 bottom-8 left-8">
          Jon Stuebe
        </h3>
        <h3 className="absolute m-0 p-0 text-white opacity-80 text-6xl bottom-8 right-8">
          {post.readingTime}
        </h3>
      </SocialCard>
    );

    const css = await fs.readFile(
      path.join(process.cwd(), "app/styles/tailwind.css"),
      "utf8"
    );

    await page.setContent(
      `<html class="font-sans"><head><link href="https://cdnjs.cloudflare.com/ajax/libs/inter-ui/3.19.3/inter.min.css" rel="stylesheet" /><style>${css}</style></head><body>${html}</body></html>`
    );

    // await page.waitForTimeout(2000);
    const screenshot = await page.screenshot({ type: "jpeg", quality: 100 });

    return new Response(screenshot, {
      headers: {
        "Content-Type": "image/jpeg",
      },
    });
  } catch {
    throw new Response("Not Found", {
      status: 404,
    });
  }
};
