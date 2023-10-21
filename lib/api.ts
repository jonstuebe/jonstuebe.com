import { promises as fs } from "fs";
import { join, resolve } from "path";
import matter from "gray-matter";
import { format, parseISO } from "date-fns";
import readingTime from "reading-time";

import { Fields, NoteType, PostType } from "~/types";

const dataDirectory = resolve(process.cwd(), "data");
const postsDirectory = join(dataDirectory, "posts");
const notesDirectory = join(dataDirectory, "notes");

async function getPostSlugs() {
  return fs.readdir(postsDirectory);
}

async function getPostBySlug(
  slug: string,
  fields: Fields[] = []
): Promise<Record<Fields, string>> {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = await fs.readFile(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return fields.reduce((items, field) => {
    if (field === "slug") {
      items[field] = realSlug;
      return items;
    }
    if (field === "content") {
      items[field] = content;
      return items;
    }

    if (field === "readingTime") {
      items[field] = readingTime(content).text;
      return items;
    }

    if (field === "date") {
      items.dateObj = data[field];
      items[field] = format(parseISO(data[field]), "PPP");
      return items;
    }

    if (data[field]) {
      items[field] = data[field];
      return items;
    }

    return items;
  }, {} as Record<Fields, string>);
}

export async function getPosts(
  slugs: string[],
  fields: Fields[] = []
): Promise<PostType[]> {
  const posts: PostType[] = [];

  for (const slug of slugs) {
    const post = await getPostBySlug(slug, fields);
    posts.push(post);
  }

  return posts.sort((post1, post2) => (post1.dateObj > post2.dateObj ? -1 : 1));
}

export async function getAllPosts(fields: Fields[] = []): Promise<PostType[]> {
  const slugs = await getPostSlugs();
  return await getPosts(slugs, fields);
}

async function getNoteSlugs() {
  return fs.readdir(notesDirectory);
}

async function getNoteBySlug(
  slug: string,
  fields: Fields[] = []
): Promise<Record<Fields, string>> {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(notesDirectory, `${realSlug}.md`);
  const fileContents = await fs.readFile(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return fields.reduce((items, field) => {
    if (field === "slug") {
      items[field] = realSlug;
      return items;
    }
    if (field === "content") {
      items[field] = content;
      return items;
    }

    if (field === "date") {
      items.dateObj = data[field];
      items[field] = format(parseISO(data[field]), "PPP");
      return items;
    }

    if (data[field]) {
      items[field] = data[field];
      return items;
    }

    return items;
  }, {} as Record<Fields, string>);
}

export async function getNotes(
  slugs: string[],
  fields: Fields[] = []
): Promise<NoteType[]> {
  const notes: NoteType[] = [];

  for (const slug of slugs) {
    const note = await getNoteBySlug(slug, fields);
    notes.push(note);
  }

  return notes.sort((note1, note2) => (note1.dateObj > note2.dateObj ? -1 : 1));
}

export async function getAllNotes(fields: Fields[] = []): Promise<NoteType[]> {
  const slugs = await getNoteSlugs();
  return await getNotes(slugs, fields);
}
