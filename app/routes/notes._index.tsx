import { MetaFunction, useLoaderData } from "@remix-run/react";
import type { HeadersFunction, LoaderFunction } from "@vercel/remix";

import Layout from "~/components/Layout";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { Note } from "~/components/Note";

import type { NoteType as NoteType } from "~/types";
import { getAllNotes } from "../../lib/api";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];

  const url = new URL(data.url);

  url.pathname = "social.jpg";
  url.searchParams.set("title", "Notes");

  const title = "Notes | Jon Stuebe";
  const description =
    "Hi, my name is Jon. Here's some notes of things I've learned recently.";

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
  const notes = await getAllNotes();

  return {
    notes: notes.sort((note1, note2) =>
      note1.dateObj > note2.dateObj ? -1 : 1
    ),
    url: request.url,
  };
};

export default function Notes() {
  const { notes } = useLoaderData<{ notes: NoteType[] }>();

  return (
    <Layout>
      <Header />
      <main className="pb-8">
        <h1 className="text-5xl font-bold lg:text-8xl tracking-tight lg:py-32 py-24 text-center motion-safe:animate-text-in-slow select-none">
          Notes
        </h1>
        <section className="flex flex-col space-y-6">
          {notes.map((note, key) => (
            <Note key={key} date={note.date} content={note.content} />
          ))}
        </section>
      </main>
      <Footer />
    </Layout>
  );
}
