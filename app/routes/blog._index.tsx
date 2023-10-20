import {
  HtmlMetaDescriptor,
  Link,
  MetaFunction,
  useLoaderData,
} from "@remix-run/react";
import type {
  HeadersFunction,
  MetaFunction,
  LoaderFunction,
} from "@vercel/remix";

import Layout from "~/components/Layout";
import { Card } from "~/components/Card";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

import { PostType } from "~/types";

export const meta: MetaFunction = ({ data }) => {
  if (!data) return [];

  const url = new URL(data.url);

  url.pathname = "social.jpg";
  url.searchParams.set("title", "Blog");

  const title = "Blog | Jon Stuebe";
  const description =
    "Hi, my name is Jon. Here's some things I've learned recently.";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:type", content: "website" },
    { property: "og:image", content: url.href },
    { property: "og:url", content: data.url },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:creator", content: "@jonstuebe" },
    { property: "twitter:title", content: title },
    { property: "twitter:image", content: url.href },
  ];
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control") ?? "max-age=43200",
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const createClient = (await import("redis")).createClient;
  const client = createClient({
    url: process.env.REDIS_URL,
  });

  await client.connect();

  const cachedPosts = await client.keys("post:*");

  const cmd = client.multi();
  for (const cachedPostName of cachedPosts) {
    cmd.hGetAll(cachedPostName);
  }

  const posts = (await cmd.exec()) as unknown as {
    slug: string;
    title: string;
    date: string;
    dateObj: string;
    image: string;
    readingTime: string;
    summary: string;
    content: string;
    html: string;
    draft: string;
  }[];

  await client.disconnect();

  return {
    posts: posts
      .filter((post) => {
        return !post.draft ? true : false;
      })
      .sort((post1, post2) => (post1.dateObj > post2.dateObj ? -1 : 1)),
    url: request.url,
  };
};

export default function Posts() {
  const { posts } = useLoaderData<{ posts: PostType[] }>();

  return (
    <Layout>
      <Header />
      <main>
        <h1 className="text-5xl font-bold lg:text-8xl tracking-tight lg:py-32 py-24 text-center motion-safe:animate-text-in-slow select-none">
          Blog
        </h1>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
          {posts.map((post, key) => {
            return (
              <Link
                className="no-underline"
                to={`/blog/${post.slug}`}
                key={key}
              >
                <Card
                  image={post.image}
                  title={post.title}
                  blurhash={post.blurhash}
                  className="motion-safe:animate-fade-in"
                >
                  <h3 className="absolute m-0 p-0 text-white opacity-80 text-base bottom-4 left-4">
                    {post.date}
                  </h3>
                  <h3 className="absolute m-0 p-0 text-white opacity-80 text-base bottom-4 right-4">
                    {post.readingTime}
                  </h3>
                </Card>
              </Link>
            );
          })}
        </section>
      </main>
      <Footer />
    </Layout>
  );
}
