import { renderToString } from "react-dom/server";
import { json, type HeadersFunction, type LoaderFunction } from "@vercel/remix";

import tailwindUrl from "~/tailwind.css";
import { SocialCard } from "~/components/SocialCard";
import { getPuppeteer } from "~/utils/puppeteer";

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control") ?? "max-age=604800",
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  try {
    const { browser } = await getPuppeteer();

    const createClient = (await import("redis")).createClient;
    const client = createClient({
      url: process.env.REDIS_URL,
    });

    await client.connect();

    const post = await client.hGetAll(`post:${params.slug}`);
    await client.disconnect();

    if (post.draft) {
      return json({});
    }

    const page = await browser.newPage();

    await page.setViewport({
      width: 2400,
      height: 1256,
      deviceScaleFactor: 1,
    });

    const html = renderToString(
      <SocialCard
        title={post.title}
        image={post.image}
        readingTime={post.readingTime}
      />
    );

    const { origin } = new URL(request.url);

    const css = origin + tailwindUrl;

    await page.setContent(
      `<html class="font-sans"><head><link href="https://cdnjs.cloudflare.com/ajax/libs/inter-ui/3.19.3/inter.min.css" rel="stylesheet" /><link href="${css}" rel="stylesheet" /></head><body>${html}</body></html>`,
      {
        waitUntil: "networkidle0",
      }
    );

    const screenshot = await page.screenshot({ type: "jpeg", quality: 80 });
    await browser.close();

    return new Response(screenshot, {
      headers: {
        "Content-Type": "image/jpeg",
      },
    });
  } catch (e: any) {
    throw new Response(e?.message ?? "Not Found", {
      status: e?.message ? 400 : 404,
    });
  }
};
