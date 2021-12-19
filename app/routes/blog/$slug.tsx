import { useLoaderData } from "remix";
import type { MetaFunction, LoaderFunction } from "remix";
import invariant from "tiny-invariant";

import { Footer } from "~/components/Footer";
import Layout from "~/components/Layout";
import { Header } from "~/components/Header";
import { PostImage } from "~/components/PostImage";

import { Post } from "~/types";
import { getPostBySlug } from "~/lib/api";
import markdownToHtml from "~/lib/markdownToHtml";

export const meta: MetaFunction = () => {
  return {
    title: "Home | Jon Stuebe",
    description:
      "Hi, my name is Jon. I make apps. I'm a Software Engineer at SmartRent.",
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "Expected params.slug");

  if (!params.slug) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  try {
    const post = await getPostBySlug(params.slug, [
      "title",
      "date",
      "slug",
      "content",
      "readingTime",
      "summary",
      "image",
    ]);

    const content = await markdownToHtml(post.content || "");

    return {
      ...post,
      content,
    };
  } catch {
    throw new Response("Not Found", {
      status: 404,
    });
  }
};

export default function Post() {
  const post = useLoaderData<Post>();

  return (
    <div className="w-full relative">
      <PostImage image={post.image} />
      <Layout className="relative z-10">
        {/* <div
            role="progressbar"
            aria-label="reading progress"
            aria-valuemax="100"
            aria-valuemin="0"
            aria-valuenow={scrollProgress * 100}
            className="h-1 fixed top-0 left-0 border-none bg-gray-600 z-10"
            style={{ width: `${scrollProgress * 100}%` }}
          /> */}
        <Header />
        <main>
          <h2 className="text-4xl font-extrabold tracking-tight text-center mt-32 mb-2 motion-safe:animate-text-in-slow">
            {post.title}
          </h2>
          <h3 className="text-xl lg:text-2xl text-center font-light text-gray-300 mt-0 mb-2 motion-safe:animate-text-in-slow">
            {post.date}
          </h3>
          <h4 className="text-xl lg:text-2xl text-center font-light text-gray-400 mt-0 mb-24 motion-safe:animate-text-in-slow">
            {post.readingTime}
          </h4>

          <article
            className="prose prose-dark lg:prose-xl w-full lg:max-w-4xl m-auto mb-32 motion-safe:animate-fade-in-slow"
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />
        </main>
        <Footer />
      </Layout>
    </div>
  );
}
