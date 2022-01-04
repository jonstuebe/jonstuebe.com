import { HeadersFunction, LoaderFunction, MetaFunction } from "remix";
import { useLoaderData } from "remix";

import Layout from "~/components/Layout";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { Heading } from "~/components/Heading";

import { TrackType } from "~/types";

type LoaderData = {
  topTracks: TrackType[];
};

export const meta: MetaFunction = () => {
  return { title: "Jon Stuebe | Music" };
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control") ?? "max-age=2592000",
  };
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  try {
    const createClient = (await import("redis")).createClient;
    const client = createClient({
      url: process.env.REDIS_URL,
    });

    await client.connect();

    const cachedTracks = await client.keys("music:topTracks:*");

    const cmd = client.multi();
    for (const cachedTrack of cachedTracks) {
      cmd.hGetAll(cachedTrack);
    }

    let topTracks = ((await cmd.exec()) as unknown as TrackType[]).sort(
      (a, b) => {
        return a.index - b.index;
      }
    );

    await client.disconnect();

    return {
      topTracks,
    };
  } catch (e) {
    return {
      topTracks: [],
    };
  }
};

export default function Music() {
  const { topTracks } = useLoaderData<LoaderData>();

  return (
    <Layout>
      <Header />
      <Heading type="h1">Music</Heading>
      <Heading type="h2">Top Tracks</Heading>

      <ul className="m-0 p-0 mb-12 flex flex-col gap-2">
        {topTracks.map((track, idx) => {
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
        })}
      </ul>
      <Footer />
    </Layout>
  );
}
