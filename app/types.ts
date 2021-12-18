export type Fields =
  | "slug"
  | "title"
  | "date"
  | "dateObj"
  | "image"
  | "readingTime"
  | "summary"
  | "content";

export type Post = Record<Fields, string>;
export type Note = Record<Fields, string>;
