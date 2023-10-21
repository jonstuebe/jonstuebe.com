export type PostType = {
  slug: string;
  title: string;
  date: string;
  dateObj: string;
  image: string;
  readingTime: string;
  summary: string;
  content: string;
  draft: boolean;
  blurhash: string;
};
export type NoteType = {
  slug: string;
  title: string;
  date: string;
  dateObj: string;
  content: string;
};

export type TrackType = {
  id: string;
  name: string;
  album: string;
  artist: string;
  image: string;
  url: string;
  index: number;
};
