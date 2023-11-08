import type { LoaderFunction } from "@vercel/remix";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

import { SocialCard } from "~/components/SocialCard";
import { formatReadingTime, getPostBySlug } from "../utils/hashnode";
import { getFont } from "../utils/social";
import { createCacheHeader } from "../utils/cache";

export const headers = createCacheHeader({ stale: "1day" });

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.slug) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  try {
    const post = await getPostBySlug(params.slug);

    const jsx = (
      <SocialCard
        title={post.title}
        image={post.coverImage.url}
        readingTime={formatReadingTime(post.readTimeInMinutes)}
      />
    );

    const svg = await satori(jsx, {
      width: 2400,
      height: 1256,
      fonts: await getFont("Inter"),
    });

    const resvg = new Resvg(svg);
    const pngData = resvg.render();
    const data = pngData.asPng();

    return new Response(data, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (e: any) {
    throw new Response(e?.message ?? "Not Found", {
      status: e?.message ? 400 : 404,
    });
  }
};
