import { useLoaderData } from "remix";
import type { MetaFunction, LoaderFunction } from "remix";
import { Footer } from "~/components/Footer";

import { Header } from "~/components/Header";
import Layout from "~/components/Layout";
import { Note } from "~/components/Note";

import { getAllNotes } from "~/lib/api";
import type { Note as NoteType } from "~/types";
import markdownToHtml from "~/lib/markdownToHtml";

export const meta: MetaFunction = () => {
  return {
    title: "Notes | Jon Stuebe",
    description:
      "Hi, my name is Jon. Here's some notes of things I've learned recently.",
  };
};

export const loader: LoaderFunction = async () => {
  let notes = await getAllNotes(["slug", "date", "content"]);

  for (const note of notes) {
    note.content = await markdownToHtml(note.content || "");
  }

  return notes;
};

export default function Notes() {
  const notes = useLoaderData<NoteType[]>();

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
