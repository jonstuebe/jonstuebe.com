export type Fields =
  | "slug"
  | "title"
  | "date"
  | "dateObj"
  | "image"
  | "readingTime"
  | "summary"
  | "content"
  | "draft"
  | "blurhash";

export type PostType = Record<Fields, string>;
export type NoteType = Record<Fields, string>;

export type TrackType = {
  id: string;
  name: string;
  album: string;
  artist: string;
  image: string;
  url: string;
  index: number;
};
