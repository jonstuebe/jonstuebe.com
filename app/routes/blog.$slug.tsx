import { MetaFunction, useLoaderData } from "@remix-run/react";
import type { HeadersFunction, LoaderFunction } from "@vercel/remix";

import Layout from "~/components/Layout";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { PostImage } from "~/components/PostImage";

import { formatReadingTime, getPostBySlug } from "../utils/hashnode";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];

  const { title } = data;
  const url = data.url as string;
  const socialImage = url.endsWith("/")
    ? url.slice(0, -1)
    : url + "/social.jpg";

  return [
    { title },
    { property: "og:title", content: title },
    { property: "og:type", content: "article" },
    { property: "og:image", content: socialImage },
    { property: "og:url", content: url },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:creator", content: "@jonstuebe" },
    { property: "twitter:title", content: title },
    { property: "twitter:image", content: socialImage + "?type=twitter" },
  ];
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control") ?? "max-age=43200",
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.slug) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  try {
    const post = await getPostBySlug(params.slug);

    return {
      ...post,
      url: request.url,
    };
  } catch (e) {
    throw new Response("Not Found", {
      status: 404,
    });
  }
};

export default function Post() {
  const post = useLoaderData<ReturnType<typeof getPostBySlug>>();

  return (
    <div className="w-full relative">
      <PostImage image={post.coverImage.url} />
      <Layout className="relative z-10">
        <Header />
        <main>
          <h2 className="text-4xl font-extrabold tracking-tight text-center mt-32 mb-2 motion-safe:animate-text-in-slow">
            {post.title}
          </h2>
          <h3 className="text-xl lg:text-2xl text-center font-light text-gray-300 mt-0 mb-2 motion-safe:animate-text-in-slow">
            {post.publishedAt}
          </h3>
          <h4 className="text-xl text-center font-light text-gray-400 mt-0 mb-24 motion-safe:animate-text-in-slow">
            {formatReadingTime(post.readTimeInMinutes)}
          </h4>
          <article
            className="prose prose-dark lg:prose-xl w-full lg:max-w-4xl m-auto mb-32 motion-safe:animate-fade-in-slow"
            dangerouslySetInnerHTML={{
              __html: post.content.html,
            }}
          />
        </main>
        <Footer />
      </Layout>
    </div>
  );
}
