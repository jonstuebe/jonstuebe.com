import { renderToString } from "react-dom/server";
import { json, type HeadersFunction, type LoaderFunction } from "@vercel/remix";

import tailwindUrl from "~/tailwind.css";
import { SocialCard } from "~/components/SocialCard";
import { getPuppeteer } from "~/utils/puppeteer";
import { getPostBySlug } from "../../lib/api";

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control") ?? "max-age=604800",
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.slug) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  try {
    const { browser } = await getPuppeteer();

    const post = await getPostBySlug(params.slug, [
      "slug",
      "title",
      "date",
      "dateObj",
      "image",
      "readingTime",
      "summary",
      "content",
      "draft",
      "blurhash",
    ]);

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
