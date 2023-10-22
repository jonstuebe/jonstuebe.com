import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  MetaFunction,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@vercel/remix";
import { Analytics } from "@vercel/analytics/react";

import favicon from "./favicon.svg";
import inter from "inter-ui/inter.css";
import styles from "./tailwind.css";

import Layout from "./components/Layout";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export const meta: MetaFunction = () => {
  return [{ title: "Jon Stuebe" }];
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      type: "image/svg+xml",
      href: favicon,
    },
    {
      rel: "stylesheet",
      href: inter,
    },
    { rel: "stylesheet", href: styles },
  ];
};

export default function App() {
  return (
    <html lang="en" className="overflow-y-scroll w-full h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <Meta />
        <Links />
      </head>
      <body className="m-0 antialiased font-sans text-white scrollbar scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-thumb-rounded-lg w-full h-full">
        <Analytics />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <html lang="en" className="overflow-y-scroll">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <title>Error - Jon Stuebe</title>
          <Meta />
          <Links />
        </head>
        <body className="m-0 antialiased font-sans text-white scrollbar scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-thumb-rounded-lg">
          <Analytics />
          <Layout>
            <Header />
            <main>
              <div className="flex flex-row items-center justify-center py-40">
                <h1 className="text-6xl tracking-tight motion-safe:animate-text-in-slow select-none">
                  {error.status}
                </h1>
                <div className="h-32 mx-8 w-1 bg-white"></div>
                <h2 className="text-6xl tracking-tight motion-safe:animate-text-in-slow select-none">
                  {error.statusText}
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

  return (
    <html lang="en" className="overflow-y-scroll">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <title>Error - Jon Stuebe</title>
        <Meta />
        <Links />
      </head>
      <body className="m-0 antialiased font-sans text-white scrollbar scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-thumb-rounded-lg">
        <Analytics />
        <Layout>
          <Header />
          <main>
            <div className="flex flex-row items-center justify-center py-40">
              <h1 className="text-6xl tracking-tight motion-safe:animate-text-in-slow select-none">
                Uh Oh
              </h1>
              <div className="h-32 mx-8 w-1 bg-white"></div>
              <h2 className="text-6xl tracking-tight motion-safe:animate-text-in-slow select-none">
                Something went wrong
              </h2>
            </div>
          </main>
          <Footer />
        </Layout>
        <Scripts />
      </body>
    </html>
  );
}
