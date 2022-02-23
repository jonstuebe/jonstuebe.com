import { useEffect } from "react";
import { HtmlMetaDescriptor, Link, useLoaderData } from "remix";
import type { HeadersFunction, MetaFunction, LoaderFunction } from "remix";

import Layout from "~/components/Layout";
import { Card } from "~/components/Card";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

import { Post } from "~/types";

export const meta: MetaFunction = ({ data }) => {
  if (!data) return {} as HtmlMetaDescriptor;

  const url = new URL(data.url);

  url.pathname = "social.jpg";
  url.searchParams.set("title", "jonstuebe.com");

  const title = "Home | Jon Stuebe";
  const description =
    "Hi, my name is Jon. I make apps. I'm an Engineering Manager at SmartRent.";

  return {
    title,
    description,
    "og:title": title,
    "og:type": "website",
    "og:image": url.href,
    "og:url": data.url,
    "twitter:card": "summary_large_image",
    "twitter:creator": "@jonstuebe",
    "twitter:title": title,
    "twitter:image": url.href,
  };
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
      .sort((post1, post2) => (post1.dateObj > post2.dateObj ? -1 : 1))
      .slice(0, 2),
    url: request.url,
  };
};

export default function Index() {
  const { posts } = useLoaderData<{ posts: Post[]; url: string }>();

  useEffect(() => {
    console.clear();
    const style = `background: black; color: white; font-size: 1.5em; font-family: sans-serif; padding: 8px;`;
    console.log("%c here to see some my work?", style);
    console.log("%c shoot me a message on twitter: @jonstuebe", style);
  }, []);

  return (
    <Layout>
      <Header />
      <main className="pb-24">
        <h2 className="text-1xl leading-none tracking-normal md:mt-36 mt-24 text-blue-400 text-left mb-3 motion-safe:animate-text-in-quick select-none">
          Hi, my name is Jon
        </h2>
        <h1 className="text-7xl leading-none font-extrabold tracking-tight mt-0 mb-4 text-left motion-safe:animate-text-in select-none">
          I make apps
        </h1>
        <h2 className="text-2xl tracking-tight m-0 text-left max-w-2xl motion-safe:animate-text-in-slow select-none">
          I'm an Engineering Manager at
          <a
            href="https://smartrent.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 text-gray-300 px-1 hover:no-underline"
          >
            SmartRent
          </a>
          . <br />I also write about code on my
          <Link
            className="bg-gray-900 text-gray-300 px-1 hover:no-underline"
            to="/blog"
          >
            Blog
          </Link>{" "}
          and on{" "}
          <a
            href="https://twitter.com/jonstuebe"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900  text-gray-300 px-1 hover:no-underline"
          >
            Twitter
          </a>
        </h2>
        <section className="md:mt-36 mt-24 mb-24">
          <h2 className="text-2xl leading-none tracking-tight m-0 text-left mb-4 select-none motion-safe:animate-fade-in">
            Recent Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        </section>
        <Footer />
      </main>
    </Layout>
  );
}
