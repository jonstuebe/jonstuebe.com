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
    title: "Blog | Jon Stuebe",
    description:
      "Hi, my name is Jon. Here's some things I've learned recently.",
  };
};

export const loader: LoaderFunction = async () => {
  const posts = await getAllPosts([
    "slug",
    "title",
    "date",
    "image",
    "readingTime",
  ]);

  return posts;
};

export default function Posts() {
  const posts = useLoaderData<Post[]>();

  return (
    <Layout>
      <Header />
      <main>
        <h1 className="text-5xl lg:text-8xl tracking-tight lg:py-32 py-24 text-center motion-safe:animate-text-in-slow select-none">
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
