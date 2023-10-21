import { useEffect } from "react";
import { Link, type MetaFunction, useLoaderData } from "@remix-run/react";
import type { HeadersFunction, LoaderFunction } from "@vercel/remix";

import { Card } from "~/components/Card";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import Layout from "~/components/Layout";

import { PostType, getPosts } from "~/utils/hashnode";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];

  const url = new URL(data.url);

  url.pathname = "social.jpg";
  url.searchParams.set("title", "jonstuebe.com");

  const title = "Home | Jon Stuebe";
  const description =
    "Hi, I'm Jon. I make apps. I'm work on design systems at SmartRent.";

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
    "Cache-Control": loaderHeaders.get("Cache-Control") ?? "max-age=600",
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const posts = await getPosts();

  return {
    posts,
    url: request.url,
  };
};

export default function Index() {
  const { posts } = useLoaderData<{ posts: PostType[] }>();

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
        <h2 className="text-2xl font-bold leading-none tracking-normal md:mt-36 mt-24 text-blue-400 text-left mb-3 motion-safe:animate-text-in-quick select-none">
          Hi, I'm Jon
        </h2>
        <h1 className="text-7xl leading-none font-extrabold tracking-tight mt-0 mb-4 text-left motion-safe:animate-text-in select-none">
          I make apps
        </h1>
        <h2 className="text-2xl font-semibold tracking-tight m-0 text-left max-w-2xl motion-safe:animate-text-in-slow select-none">
          I work on design systems at
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
          <h2 className="text-2xl font-bold leading-none tracking-tight m-0 text-left mb-4 select-none motion-safe:animate-fade-in">
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
                    image={post.coverImage.url}
                    title={post.title}
                    className="motion-safe:animate-fade-in"
                  >
                    <h3 className="absolute m-0 p-0 font-semibold text-white opacity-80 text-base bottom-4 left-4">
                      {post.publishedAt}
                    </h3>
                    <h3 className="absolute m-0 p-0 font-semibold text-white opacity-80 text-base bottom-4 right-4">
                      {post.readTimeInMinutes} minutes
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
