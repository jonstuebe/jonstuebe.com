import { HtmlMetaDescriptor, useLoaderData } from "remix";
import type { HeadersFunction, MetaFunction, LoaderFunction } from "remix";

import Layout from "~/components/Layout";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { Note } from "~/components/Note";

import type { Note as NoteType } from "~/types";

export const meta: MetaFunction = ({ data }) => {
  if (!data) return {} as HtmlMetaDescriptor;

  const url = new URL(data.url);

  url.pathname = "social.jpg";
  url.searchParams.set("title", "Notes");

  const title = "Notes | Jon Stuebe";
  const description =
    "Hi, my name is Jon. Here's some notes of things I've learned recently.";

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

  const cachedNotes = await client.keys("note:*");

  const cmd = client.multi();
  for (const cachedNoteName of cachedNotes) {
    cmd.hGetAll(cachedNoteName);
  }

  const notes = (await cmd.exec()) as unknown as {
    slug: string;
    title: string;
    date: string;
    dateObj: string;
    image: string;
    readingTime: string;
    summary: string;
    content: string;
    html: string;
  }[];

  await client.disconnect();

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
        <h1 className="text-5xl lg:text-8xl tracking-tight lg:py-32 py-24 text-center motion-safe:animate-text-in-slow select-none">
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
