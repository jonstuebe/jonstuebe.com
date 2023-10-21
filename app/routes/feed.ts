import { format, parseISO } from "date-fns";
import { LoaderFunction } from "@vercel/remix";

export const loader: LoaderFunction = async ({ params }) => {
  const sanitize = (text: string) => {
    return text.replace(/&/g, "&amp;");
  };

  const createClient = (await import("redis")).createClient;
  const client = createClient({
    url: process.env.REDIS_URL,
  });

  await client.connect();

  const cachedPosts = await client.keys("post:*");

  const cmd = client.multi();
  for (const cachedPostName of cachedPosts) {
    cmd.hGetAll(cachedPostName);
  }

  const posts = (await cmd.exec()) as unknown as {
    slug: string;
    title: string;
    date: string;
    dateObj: string;
    image: string;
    readingTime: string;
    summary: string;
    content: string;
    html: string;
    draft: string;
  }[];

  await client.disconnect();

  const postItems = posts
    .filter((post) => {
      return !post.draft ? true : false;
    })
    .sort((post1, post2) => (post1.dateObj > post2.dateObj ? -1 : 1))
    .map((post) => {
      return [
        `<item>`,
        `<title>${sanitize(post.title)}</title>`,
        `<pubDate>${format(
          parseISO(post.dateObj),
          "E',' d MMM yyyy"
        )}</pubDate>`,
        `<content:encoded><![CDATA[${post.content}]]></content:encoded>`,
        `<description><![CDATA[<img src="${post.image}" />]]></description>`,
        `<link>${`https://jonstuebe.com/blog/${post.slug}`}</link>`,
        `</item>`,
      ].join("");
    });

  const rss = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
    xmlns:media="http://search.yahoo.com/mrss/" xmlns:georss="http://www.georss.org/georss" xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#">`,
    `<channel>`,
    `<title>jonstuebe.com</title>`,
    `<atom:link href="https://jonstuebe.com/rss.xml" rel="self" type="application/rss+xml" />`,
    `<link>https://jonstuebe.com</link>`,
    `<description></description>`,
    `<language>en</language>`,
    `<docs>https://cyber.harvard.edu/rss/rss.html</docs>`,
    `<sy:updatePeriod>daily</sy:updatePeriod>`, // can be one of: hourly | daily | weekly | monthly | yearly
    ...postItems,
    `</channel>`,
    `</rss>`,
  ];

  return new Response(rss.join(""), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "x-content-type-options": "nosniff",
    },
  });
};
