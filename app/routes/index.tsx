import { useEffect } from "react";
import { Link, useLoaderData } from "remix";
import type { MetaFunction, LoaderFunction } from "remix";
import { Card } from "~/components/Card";
import { Footer } from "~/components/Footer";

import { Header } from "~/components/Header";
import Layout from "~/components/Layout";

import { getAllPosts } from "~/lib/api";
import { Post } from "~/types";

export const meta: MetaFunction = () => {
  return {
    title: "Home | Jon Stuebe",
    description:
      "Hi, my name is Jon. I make apps. I'm a Software Engineer at SmartRent.",
  };
};

export const loader: LoaderFunction = async () => {
  const posts = (
    await getAllPosts(["slug", "title", "date", "image", "readingTime"])
  ).slice(0, 2);

  return posts;
};

export default function Index() {
  const posts = useLoaderData<Post[]>();

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
          I'm a Software Engineer at
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
