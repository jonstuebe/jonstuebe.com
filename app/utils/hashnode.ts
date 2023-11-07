import { format, parseISO } from "date-fns";
import type { Options as RehypeCodeOptions } from "rehype-pretty-code";
import path from "path";

export interface PostType {
  title: string;
  subtitle: string;
  slug: string;
  publishedAt: string;
  readTimeInMinutes: number;
  coverImage: {
    isPortrait: boolean;
    attribution: string;
    photography: string;
    url: string;
  };
  content: {
    markdown: string;
    html: string;
  };
}

export function formatReadingTime(readTimeInMinutes: number) {
  return readTimeInMinutes > 1
    ? `${readTimeInMinutes} minutes`
    : `${readTimeInMinutes} minute`;
}

async function addPostMetadata(post: PostType) {
  const shiki = await import("shiki");
  const unified = (await import("unified")).unified;
  const remarkRehype = (await import("remark-rehype")).default;
  const remarkParse = (await import("remark-parse")).default;
  const remarkGfm = (await import("remark-gfm")).default;
  const rehypeStringify = (await import("rehype-stringify")).default;
  const rehypePrettyCode = (await import("rehype-pretty-code")).default;

  const getHighlighter: RehypeCodeOptions["getHighlighter"] = async (
    options
  ) => {
    const highlighter = await shiki.getHighlighter({
      ...(options as any),
      paths: {
        languages: path.join(process.cwd(), "public", "/languages"),
        themes: path.join(process.cwd(), "public", "/themes"),
      },
    });

    return highlighter;
  };

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    // @ts-expect-error
    .use(rehypePrettyCode, {
      theme: "one-dark-pro",
      keepBackground: false,
      getHighlighter,
    })
    .use(rehypeStringify)
    .process(post.content.markdown);

  return {
    ...post,
    publishedAt: format(parseISO(post.publishedAt), "PPP"),
    content: {
      ...post.content,
      html: file.value.toString(),
    },
  };
}

async function gql<TType>(query: string) {
  if (!process.env.HASHNODE_SECRET) {
    throw new Error("process.env.HASHNODE_SECRET missing");
  }

  const data = await fetch("https://gql.hashnode.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.HASHNODE_SECRET,
    },
    body: JSON.stringify({
      query,
    }),
  })
    .then((res) => res.json())
    .then((res) => res.data as TType);

  return data;
}

export async function getPosts(count = 2, after?: string): Promise<PostType[]> {
  const data = await gql<{
    publication: {
      posts: {
        edges: { node: PostType }[];
      };
    };
  }>(`{
    publication(host: "jonstuebe.hashnode.dev") {
      posts(first: ${count}${after ? `, after: "${after}"` : ""}) {
        edges {
          node {
            title
            subtitle
            slug
            publishedAt
            readTimeInMinutes
            coverImage {
              isPortrait
              attribution
              photographer
              url
            }
            content {
              markdown
            }
          }
        }
      }
    }
  }`);
  const posts: PostType[] = [];

  for (const edge of data.publication.posts.edges) {
    posts.push(await addPostMetadata(edge.node));
  }

  return posts;
}

export async function getPostBySlug(slug: string): Promise<PostType> {
  const data = await gql<{
    publication: {
      post: PostType;
    };
  }>(`{
    publication(host: "jonstuebe.hashnode.dev") {
      post(slug: "${slug}") {
        title
        subtitle
        slug
        publishedAt
        readTimeInMinutes
        coverImage {
          isPortrait
          attribution
          photographer
          url
        }              
        content {
          markdown
        }
      }
    }
  }`);

  return await addPostMetadata(data.publication.post);
}
