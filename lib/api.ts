import { promises as fs } from "fs";
import { join, resolve } from "path";
import matter from "gray-matter";
import { format, parseISO } from "date-fns";
import readingTime from "reading-time";
import sharp from "sharp";
import { encode } from "blurhash";
import path from "path";

import { NoteType, PostType } from "~/types";
import markdownToHtml from "./markdownToHtml";

const dataDirectory = resolve(process.cwd(), "data");
const postsDirectory = join(dataDirectory, "posts");
const notesDirectory = join(dataDirectory, "notes");

export async function getPostSlugs() {
  return fs.readdir(postsDirectory);
}

async function exists(filename: string) {
  try {
    await fs.access(filename);
    return true;
  } catch (error) {
    return false;
  }
}

const cacheDirectory = path.join(process.cwd(), ".cache");
const encodeKey = (key: string) => Buffer.from(key).toString("base64");
async function getCacheItem(key: string, subPath: string) {
  const encodedKey = encodeKey(key);
  const cachePath = path.join(cacheDirectory, subPath, `${encodedKey}.json`);

  if (!(await exists(cachePath))) return undefined;

  const item = await fs.readFile(cachePath, "utf8");

  try {
    return JSON.parse(item);
  } catch (e) {
    return undefined;
  }
}

async function putCacheItem(
  key: string,
  data: Record<string, any>,
  subPath: string
) {
  const encodedKey = encodeKey(key);

  if (!(await exists(path.join(cacheDirectory, subPath)))) {
    await fs.mkdir(path.join(cacheDirectory, subPath));
  }

  await fs.writeFile(
    path.join(cacheDirectory, subPath, `${encodedKey}.json`),
    JSON.stringify(data),
    "utf8"
  );
}

async function encodeImageToBlurhash(url: string): Promise<string> {
  const res = await fetch(url);
  const resBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(resBuffer);

  return new Promise((resolve, reject) => {
    sharp(buffer)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: "inside" })
      .toBuffer((err, buffer, { width, height }) => {
        if (err) return reject(err);
        resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
      });
  });
}

export async function getPostBySlug(slug: string) {
  const cacheKey = `post:${slug}`;
  const cachedPost = await getCacheItem(cacheKey, "posts");

  if (cachedPost) return cachedPost;

  const post = await _getPostBySlug(slug);

  await putCacheItem(cacheKey, post, "posts");

  return post;
}

async function _getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = await fs.readFile(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const html = await markdownToHtml(content);
  const blurhash: string = data.image
    ? await encodeImageToBlurhash(data.image)
    : "";

  return {
    slug: realSlug,
    title: data.title,
    date: format(parseISO(data.date), "PPP"),
    dateObj: data.date,
    image: data.image,
    readingTime: readingTime(content).text,
    summary: data.summary,
    content: html,
    draft: data.draft,
    blurhash: blurhash,
  } satisfies PostType;
}

export async function getPosts(slugs: string[]): Promise<PostType[]> {
  const posts: PostType[] = [];

  for (const slug of slugs) {
    const post = await getPostBySlug(slug);
    posts.push(post);
  }

  return posts.sort((post1, post2) => (post1.dateObj > post2.dateObj ? -1 : 1));
}

export async function getRecentPosts(numOfPosts: number): Promise<PostType[]> {
  const slugs = await getPostSlugs();
  return await getPosts(slugs.slice(0, numOfPosts + 1));
}

export async function getAllPosts(): Promise<PostType[]> {
  const slugs = await getPostSlugs();
  return await getPosts(slugs);
}

export async function getNoteSlugs() {
  return fs.readdir(notesDirectory);
}

async function getNoteBySlug(slug: string) {
  const cacheKey = `note:${slug}`;
  const cachedNote = await getCacheItem(cacheKey, "notes");

  if (cachedNote) return cachedNote;

  const note = await _getNoteBySlug(slug);

  await putCacheItem(cacheKey, note, "notes");

  return note;
}

async function _getNoteBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(notesDirectory, `${realSlug}.md`);
  const fileContents = await fs.readFile(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const html = await markdownToHtml(content);

  return {
    slug: realSlug,
    title: data.title,
    date: format(parseISO(data.date), "PPP"),
    dateObj: data.date,
    content: html,
  } satisfies NoteType;
}

export async function getNotes(slugs: string[]) {
  const notes: NoteType[] = [];

  for (const slug of slugs) {
    const note = await getNoteBySlug(slug);
    notes.push(note);
  }

  return notes.sort((note1, note2) => (note1.dateObj > note2.dateObj ? -1 : 1));
}

export async function getAllNotes() {
  const slugs = await getNoteSlugs();
  return await getNotes(slugs);
}
