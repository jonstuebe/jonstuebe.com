import { format, parseISO } from "date-fns";

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

function addPostMetadata(post: PostType) {
  return {
    ...post,
    publishedAt: format(parseISO(post.publishedAt), "PPP"),
  };
}

async function gql<TType>(query: string) {
  const data = await fetch("https://gql.hashnode.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: ***REMOVED***,
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
              html
            }
          }
        }
      }
    }
  }`);

  return data.publication.posts.edges.map((edge) => addPostMetadata(edge.node));
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
          html
        }
      }
    }
  }`);

  return addPostMetadata(data.publication.post);
}
