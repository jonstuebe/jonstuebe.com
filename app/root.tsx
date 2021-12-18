import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "remix";
import type { LinksFunction, MetaFunction } from "remix";

import inter from "inter-ui/inter.css";
import tailwindUrl from "./styles/tailwind.css";
import Layout from "./components/Layout";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: inter,
    },
    { rel: "stylesheet", href: tailwindUrl },
  ];
};

export default function App() {
  return (
    <html lang="en" className="overflow-y-scroll">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="m-0 antialiased font-sans bg-black text-white scrollbar scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-thumb-rounded-lg">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <html lang="en" className="overflow-y-scroll">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Error - Jon Stuebe</title>
        <Meta />
        <Links />
      </head>
      <body className="m-0 antialiased font-sans bg-black text-white scrollbar scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-thumb-rounded-lg">
        <Layout>
          <Header />
          <main>
            <div className="flex flex-row items-center justify-center py-40">
              <h1 className="text-6xl tracking-tight motion-safe:animate-text-in-slow select-none">
                {caught.status}
              </h1>
              <div className="h-32 mx-8 w-1 bg-white"></div>
              <h2 className="text-6xl tracking-tight motion-safe:animate-text-in-slow select-none">
                {caught.statusText}
              </h2>
            </div>
          </main>
          <Footer />
        </Layout>

        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
