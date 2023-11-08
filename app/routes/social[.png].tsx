import { Resvg } from "@resvg/resvg-js";
import type { LoaderFunction } from "@vercel/remix";
import satori from "satori";

import { SocialCard } from "~/components/SocialCard";
import { createCacheHeader } from "../utils/cache";
import { getFont } from "../utils/social";

export const headers = createCacheHeader({ stale: "1month" });

export const loader: LoaderFunction = async ({ request, params }) => {
  try {
    const url = new URL(request.url);
    const title = url.searchParams.get("title") as string;
    const image = url.searchParams.has("image")
      ? (url.searchParams.get("image") as string)
      : undefined;

    const jsx = <SocialCard title={title} image={image} />;

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
