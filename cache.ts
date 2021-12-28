import { createClient } from "redis";

import { getAllNotes, getAllPosts } from "./lib/api";
import markdownToHtml from "./lib/markdownToHtml";

require("dotenv").config();

(async () => {
  const client = createClient({
    url: process.env.REDIS_URL,
  });

  await client.connect();
  const cmd = client.multi();

  // posts
  const cachedPosts = await client.keys("post:*");

  for (const post of cachedPosts) {
    cmd.hDel(post, [
      "title",
      "date",
      "slug",
      "content",
      "readingTime",
      "summary",
      "image",
      "dateObj",
      "draft",
    ]);
  }

  const posts = await getAllPosts([
    "title",
    "date",
    "slug",
    "content",
    "readingTime",
    "summary",
    "image",
    "dateObj",
    "draft",
  ]);

  for (const post of posts) {
    cmd.hSet(`post:${post.slug}`, {
      ...post,
      content: await markdownToHtml(post.content),
    });
  }

  // notes
  const cachedNotes = await client.keys("note:*");

  for (const note of cachedNotes) {
    cmd.hDel(note, [
      "title",
      "date",
      "slug",
      "content",
      "readingTime",
      "summary",
      "image",
      "dateObj",
      "draft",
    ]);
  }

  const notes = await getAllNotes([
    "title",
    "date",
    "slug",
    "content",
    "readingTime",
    "summary",
    "image",
    "dateObj",
    "draft",
  ]);

  for (const note of notes) {
    cmd.hSet(`note:${note.slug}`, {
      ...note,
      content: await markdownToHtml(note.content),
    });
  }

  await cmd.exec();
  await client.disconnect();
})();
