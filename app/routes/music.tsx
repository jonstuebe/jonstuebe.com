import { useState } from "react";
import type { HeadersFunction, LoaderFunction, MetaFunction } from "remix";
import { useLoaderData } from "remix";
import Spotify from "spotify-web-api-node";

import Layout from "~/components/Layout";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { Heading } from "~/components/Heading";

type TrackType = {
  name: string;
  album: string;
  artist: string;
  image: string;
  url: string;
};

type ArtistType = {
  name: string;
  image: string;
  url: string;
};

type LoaderData = {
  topTracks: TrackType[];
  topArtists: ArtistType[];
};

export const meta: MetaFunction = () => {
  return { title: "Jon Stuebe | Music" };
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control") ?? "max-age=43200",
  };
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  if (!process.env.SPOTIFY_ACCESS_TOKEN) {
    throw new Error("SPOTIFY_ACCESS_TOKEN token required");
  }

  const spotify = new Spotify();
  spotify.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

  const topTracks: TrackType[] = (
    await spotify.getMyTopTracks({ limit: 10 })
  ).body.items.map((item) => ({
    url: item.href.replace(
      "api.spotify.com/v1/tracks/",
      "open.spotify.com/track/"
    ),
    name: item.name,
    artist: item.artists.map((artist) => artist.name).join(", "),
    album: item.album.name,
    image: item.album.images[0].url,
  }));

  const topArtists: ArtistType[] = (
    await spotify.getMyTopArtists({ limit: 10 })
  ).body.items.map((item) => ({
    url: item.href.replace(
      "api.spotify.com/v1/artists/",
      "open.spotify.com/artist/"
    ),
    name: item.name,
    image: item.images[0].url,
  }));

  return {
    topTracks,
    topArtists,
  };
};

export default function Music() {
  const [type, setType] = useState<"tracks" | "artists">("tracks");
  const { topTracks, topArtists } = useLoaderData<LoaderData>();

  return (
    <Layout>
      <Header />
      <Heading type="h1">Music</Heading>

      <nav className="flex gap-4 mb-4" aria-label="Tabs">
        <button
          className={
            "no-underline px-3 py-2 font-semibold text-sm rounded-md border-none cursor-pointer" +
            (type === "tracks"
              ? " bg-gray-200 text-gray-800"
              : " text-gray-300 hover:text-gray-400 bg-transparent")
          }
          onClick={(e) => {
            setType("tracks");
            e.preventDefault();
          }}
        >
          Top Tracks
        </button>

        <button
          className={
            "no-underline px-3 py-2 font-semibold text-sm rounded-md border-none cursor-pointer" +
            (type === "artists"
              ? " bg-gray-200 text-gray-800"
              : " text-gray-300 hover:text-gray-400 bg-transparent")
          }
          onClick={(e) => {
            setType("artists");
            e.preventDefault();
          }}
        >
          Top Artists
        </button>
      </nav>

      <ul className="m-0 p-0 mb-12 flex flex-col gap-2">
        {type === "tracks"
          ? topTracks.map((track, idx) => {
              return (
                <li key={idx} className="list-none">
                  <a
                    href={track.url}
                    target="_blank"
                    className="group relative drop-shadow-md hover:drop-shadow-xl text-gray-500 no-underline rounded-lg p-3 bg-slate-900 hover:bg-slate-800 flex items-center"
                  >
                    <p className="absolute font-extrabold opacity-0 group-hover:opacity-100 text-lg group-hover:text-gray-400 mr-4 ml-1">
                      {idx + 1}
                    </p>
                    <div className="group-hover:ml-9 transition-all ease-in-out motion-reduce:transition-none motion-reduce:transform-none rounded-lg group-hover:scale-110 overflow-hidden w-24 h-24">
                      <img src={track.image} className="w-24 h-24" />
                    </div>
                    <div className="w-full overflow-hidden flex-1 ml-4">
                      <p className="text-xl font-medium text-gray-400 group-hover:text-gray-300 m-0">
                        {track.name}
                      </p>
                      <p className="text-md font-medium text-gray-500 group-hover:text-gray-400 m-0 truncate">
                        {track.artist}
                      </p>
                    </div>
                  </a>
                </li>
              );
            })
          : topArtists.map((artist, idx) => {
              return (
                <li key={idx} className="list-none">
                  <a
                    href={artist.url}
                    target="_blank"
                    className="group relative drop-shadow-md hover:drop-shadow-xl text-gray-500 no-underline rounded-lg p-3 bg-slate-900 hover:bg-slate-800 flex items-center"
                  >
                    <p className="absolute font-extrabold opacity-0 group-hover:opacity-100 text-lg group-hover:text-gray-400 mr-4 ml-1">
                      {idx + 1}.
                    </p>
                    <div className="group-hover:ml-9 transition-all ease-in-out motion-reduce:transition-none motion-reduce:transform-none rounded-lg group-hover:scale-110 overflow-hidden w-24 h-24">
                      <img src={artist.image} className="w-24 h-24" />
                    </div>
                    <div className="w-full overflow-hidden flex-1 ml-4">
                      <p className="text-xl font-medium text-gray-400 group-hover:text-gray-300 m-0">
                        {artist.name}
                      </p>
                    </div>
                  </a>
                </li>
              );
            })}
      </ul>
      <Footer />
    </Layout>
  );
}
