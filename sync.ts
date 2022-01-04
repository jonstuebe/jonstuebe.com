import { createClient } from "redis";
import { encode } from "blurhash";
import fprint from "fprint";
import path from "path";
import chalk from "chalk";
import { promises as fs } from "fs";
import { globbySync } from "globby";
import fetch from "node-fetch";
import sharp from "sharp";

import { getNotes, getPosts } from "./lib/api";
import markdownToHtml from "./lib/markdownToHtml";
import SpotifyWebApi from "spotify-web-api-node";
import { TrackType } from "~/types";

require("dotenv").config();

const encodeImageToBlurhash = async (url: string): Promise<string> => {
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
};

const fingerprintPostsPath = path.join(
  process.cwd(),
  ".cache/fingerprint-posts.json"
);
const fingerprintNotesPath = path.join(
  process.cwd(),
  ".cache/fingerprint-notes.json"
);

function getPostPaths() {
  return globbySync(path.join(process.cwd(), "data/posts/**.md"));
}

function getPostSlugs() {
  return getPostPaths().map((postpath) => {
    return path.basename(postpath).replace(".md", "");
  });
}

function getNotePaths() {
  return globbySync(path.join(process.cwd(), "data/notes/**.md"));
}

function getNoteSlugs() {
  return getNotePaths().map((notepath) => {
    return path.basename(notepath).replace(".md", "");
  });
}

async function fingerprintPosts() {
  const postpaths = getPostPaths();
  let manifest: Record<string, string> = {};

  for (const postpath of postpaths) {
    const fingerprint = await fprint(postpath, "sha256");
    const slug = path.basename(postpath).replace(".md", "");

    manifest[slug] = fingerprint;
  }

  await fs.writeFile(
    path.join(process.cwd(), ".cache/fingerprint-posts.json"),
    JSON.stringify(manifest, null, 2),
    {
      encoding: "utf8",
    }
  );
}

async function fingerprintNotes() {
  const notepaths = getNotePaths();
  let manifest: Record<string, string> = {};

  for (const notepath of notepaths) {
    const fingerprint = await fprint(notepath, "sha256");
    const slug = path.basename(notepath).replace(".md", "");

    manifest[slug] = fingerprint;
  }

  await fs.writeFile(
    path.join(process.cwd(), ".cache/fingerprint-notes.json"),
    JSON.stringify(manifest, null, 2),
    {
      encoding: "utf8",
    }
  );
}

async function exists(filePath: string) {
  const { exists } = await fs
    .access(filePath)
    .then(() => {
      return { exists: true };
    })
    .catch(() => {
      return { exists: false };
    });

  return exists;
}

async function getPostsFingerprints(): Promise<Record<string, string> | null> {
  if (await exists(fingerprintPostsPath)) {
    return JSON.parse(await fs.readFile(fingerprintPostsPath, "utf8"));
  }

  return null;
}

async function getNotesFingerprints(): Promise<Record<string, string> | null> {
  if (await exists(fingerprintNotesPath)) {
    return JSON.parse(await fs.readFile(fingerprintNotesPath, "utf8"));
  }

  return null;
}

async function hasPostChanged(slug: string): Promise<boolean> {
  const postsFingerprints = await getPostsFingerprints();

  // no fingerprints exist so we assume the post has changed
  if (postsFingerprints === null) {
    return true;
  }

  // slug doesn't exist in fingerprints so we assume the post has changed
  if (!postsFingerprints[slug]) {
    return true;
  }

  const postpath = path.join(process.cwd(), `data/posts/${slug}.md`);
  const postFingerprint = await fprint(postpath, "sha256");

  if (postsFingerprints[slug] !== postFingerprint) {
    return true;
  }

  return false;
}

async function hasNoteChanged(slug: string): Promise<boolean> {
  const notesFingerprints = await getNotesFingerprints();

  // no fingerprints exist so we assume the note has changed
  if (notesFingerprints === null) {
    return true;
  }

  // slug doesn't exist in fingerprints so we assume the note has changed
  if (!notesFingerprints[slug]) {
    return true;
  }

  const notepath = path.join(process.cwd(), `data/notes/${slug}.md`);
  const noteFingerprint = await fprint(notepath, "sha256");

  if (notesFingerprints[slug] !== noteFingerprint) {
    return true;
  }

  return false;
}

async function getChangedPosts(): Promise<string[]> {
  const changed: string[] = [];
  const postpaths = getPostPaths();

  for (const postpath of postpaths) {
    const slug = path.basename(postpath).replace(".md", "");
    if (await hasPostChanged(slug)) {
      changed.push(slug);
    }
  }

  return changed;
}

async function getChangedNotes(): Promise<string[]> {
  const changed: string[] = [];
  const notepaths = getNotePaths();

  for (const notepath of notepaths) {
    const slug = path.basename(notepath).replace(".md", "");
    if (await hasNoteChanged(slug)) {
      changed.push(slug);
    }
  }

  return changed;
}

async function getTopTracks(): Promise<TrackType[]> {
  if (!process.env.SPOTIFY_ACCESS_TOKEN) {
    throw new Error("SPOTIFY_ACCESS_TOKEN token required");
  }

  const spotify = new SpotifyWebApi();

  spotify.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN as string);

  const topTracks: TrackType[] = (
    await spotify.getMyTopTracks({ limit: 10 })
  ).body.items.map((item, idx) => ({
    url: item.href.replace(
      "api.spotify.com/v1/tracks/",
      "open.spotify.com/track/"
    ),
    name: item.name,
    artist: item.artists.map((artist) => artist.name).join(", "),
    album: item.album.name,
    image: item.album.images[0].url,
    id: item.id,
    index: idx,
  }));

  return topTracks;
}

(async () => {
  // if ((await getPostsFingerprints()) === null) {
  //   await fingerprintPosts();
  // }

  const changedPosts = await getChangedPosts();
  if (changedPosts.length === 0) {
    console.log(chalk.green("No Post Changes"));
  }

  // if ((await getNotesFingerprints()) === null) {
  //   await fingerprintNotes();
  // }

  const changedNotes = await getChangedNotes();
  if (changedNotes.length === 0) {
    console.log(chalk.green("No Note Changes"));
  }

  const client = createClient({
    url: process.env.REDIS_URL,
  });

  await client.connect();
  const cmd = client.multi();

  // get all post keys from redis
  const cachedPostsSlugs = (await client.keys("post:*")).map((p) =>
    p.replace("post:", "")
  );
  const postSlugs = getPostSlugs();

  // detect which posts should be removed from the redis cache
  const postsToPurge = cachedPostsSlugs.filter((slug) => {
    return !postSlugs.includes(slug);
  });

  for (const postToPurge of postsToPurge) {
    cmd.hDel(`post:${postToPurge}`, [
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
    console.log(chalk.red(`Purging Post: ${postToPurge}`));
  }

  const posts = await getPosts(changedPosts, [
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
    const blurhash = await encodeImageToBlurhash(post.image);
    cmd.hDel(`post:${post.slug}`, ["draft"]);
    cmd.hSet(`post:${post.slug}`, {
      ...post,
      blurhash,
      content: await markdownToHtml(post.content),
    });
    console.log(chalk.green(`Caching Post: ${post.title}`));
  }
  await fingerprintPosts();

  // get all note keys from redis
  const cachedNotesSlugs = (await client.keys("note:*")).map((p) =>
    p.replace("note:", "")
  );
  const noteSlugs = getNoteSlugs();

  // detect which notes should be removed from the redis cache
  const notesToPurge = cachedNotesSlugs.filter((slug) => {
    return !noteSlugs.includes(slug);
  });

  for (const noteToPurge of notesToPurge) {
    cmd.hDel(`note:${noteToPurge}`, [
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
    console.log(chalk.red(`Purging Note: ${noteToPurge}`));
  }

  const notes = await getNotes(changedNotes, [
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
  await fingerprintNotes();

  const cachedTracks = await client.keys("music:topTracks:*");

  for (const cachedTrack of cachedTracks) {
    cmd.hDel(cachedTrack, [
      "url",
      "name",
      "artist",
      "album",
      "image",
      "id",
      "index",
    ]);
  }

  await cmd.exec();

  const topTracks = await getTopTracks();

  for (const track of topTracks) {
    await client.hSet(`music:topTracks:${track.id}`, track);
  }
  console.log(chalk.green("Updated Top Tracks"));

  await client.disconnect();
})();
