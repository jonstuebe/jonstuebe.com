import { useLoaderData } from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@vercel/remix";

import { Heading } from "~/components/Heading";
import { createCacheHeader } from "../utils/cache";

type App = {
  name: string;
  url: string;
  description: string;
};

type Extension = {
  name: string;
  url: string;
};

export const headers = createCacheHeader({ stale: "1week" });

export const links: LinksFunction = () => {
  return [
    {
      href: "https://fonts.googleapis.com/css2?family=Fira+Code&display=swap",
      rel: "stylesheet",
    },
  ];
};

export const loader: LoaderFunction = ({ request }) => {
  const apps: App[] = [
    {
      name: "Raycast",
      url: "https://www.raycast.com/",
      description: "for launching everything...quickly.",
    },
    {
      name: "Screen Studio",
      url: "https://www.screen.studio/",
      description: "create high quality videos as easy as taking a screenshot.",
    },
    {
      name: "Obsidian",
      url: "https://obsidian.md/",
      description: "writing app that I use as a second brain to store notes",
    },
    {
      name: "Bartender",
      url: "https://www.macbartender.com/",
      description: "for cleaning up my menu bar.",
    },
    {
      name: "CleanShot X",
      url: "https://cleanshot.com/",
      description:
        "for taking screenshots, recording videos, and making gif's.",
    },
    {
      name: "Krisp",
      url: "https://krisp.ai/",
      description: "for muting background noise.",
    },
    {
      name: "LittleIpsum",
      url: "https://apps.apple.com/us/app/littleipsum/id405772121?mt=12",
      description: "for generating lorem ipsum from my menu bar.",
    },
    {
      name: "Paprika",
      url: "https://www.paprikaapp.com/",
      description: "for managing and syncing recipes across my devices.",
    },
    {
      name: "Postico",
      url: "https://eggerapps.at/postico/",
      description: "for browsing and navigating around Postgres db's.",
    },
    {
      name: "SoundSource",
      url: "https://rogueamoeba.com/soundsource/",
      description: "for better system audio controls.",
    },
  ];

  const extensions: Extension[] = [
    {
      name: "change-case",
      url: "https://marketplace.visualstudio.com/items?itemName=wmaurer.change-case",
    },
    {
      name: "colorize",
      url: "https://marketplace.visualstudio.com/items?itemName=kamikillerto.vscode-colorize",
    },
    {
      name: "DotENV",
      url: "https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv",
    },
    {
      name: "Encode Decode",
      url: "https://marketplace.visualstudio.com/items?itemName=mitchdenny.ecdc",
    },
    {
      name: "generact",
      url: "https://marketplace.visualstudio.com/items?itemName=Dennitz.vscode-generact",
    },
    {
      name: "GitLens",
      url: "https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens",
    },
    {
      name: "Import Cost",
      url: "https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost",
    },
    {
      name: "Incrementor",
      url: "https://marketplace.visualstudio.com/items?itemName=nmsmith89.incrementor",
    },
    {
      name: "LintLens",
      url: "https://marketplace.visualstudio.com/items?itemName=ghmcadams.lintlens",
    },
    {
      name: "MDX",
      url: "https://marketplace.visualstudio.com/items?itemName=silvenon.mdx",
    },
    {
      name: "Multiple cursor case preserve",
      url: "https://marketplace.visualstudio.com/items?itemName=Cardinal90.multi-cursor-case-preserve",
    },
    {
      name: "Path Intellisense",
      url: "https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense",
    },
    {
      name: "Polacode",
      url: "https://marketplace.visualstudio.com/items?itemName=pnp.polacode",
    },
    {
      name: "PostCSS Language Support",
      url: "https://marketplace.visualstudio.com/items?itemName=csstools.postcss",
    },
    {
      name: "Prettier",
      url: "https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode",
    },
    {
      name: "Quokka.js",
      url: "https://marketplace.visualstudio.com/items?itemName=WallabyJs.quokka-vscode",
    },
    {
      name: "Tailwind CSS IntelliSense",
      url: "https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss",
    },
    {
      name: "Template String Converter",
      url: "https://marketplace.visualstudio.com/items?itemName=meganrogge.template-string-converter",
    },
    {
      name: "YAML",
      url: "https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) ",
    },
  ];

  return {
    apps,
    extensions,
  };
};

export default function UsesPage() {
  const { apps, extensions } = useLoaderData<{
    apps: App[];
    extensions: Extension[];
  }>();
  return (
    <>
      <Heading type="h1">Uses</Heading>

      <div className="grid gap-8 grid-cols-1">
        <div>
          <h2 className="pl-2 text-4xl font-bold mb-8">Apps</h2>
          <div className="grid gap-8 sm:grid-cols-2 grid-cols-1">
            {apps.map((app, idx) => {
              return (
                <a
                  href={app.url}
                  target="_blank"
                  className="transform transition-transform duration-300 hover:scale-105 block no-underline rounded-md bg-slate-900 opacity-80 hover:opacity-100 p-4"
                  key={idx}
                >
                  <h3 className="p-0 m-0 mb-2 font-bold text-gray-300 text-xl">
                    {app.name}
                  </h3>
                  <p className="text-gray-400 m-0 p-0">{app.description}</p>
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <div className="grid gap-8 sm:grid-cols-2 grid-cols-1">
            <h2 className="pl-2 text-4xl font-bold mb-8">Editor</h2>
            <h2 className="pl-2 text-4xl font-bold mb-8">Extensions</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 grid-cols-1">
            <a
              href="https://code.visualstudio.com/"
              target="_blank"
              className="transform transition-transform duration-300 hover:scale-105 relative rounded-md w-full overflow-hidden h-40 no-underline text-gray-400 hover:text-gray-200"
            >
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <img
                  src="https://source.unsplash.com/aZEBwDrdcSs/987x1480"
                  className={
                    "absolute w-full h-full absolute-center object-cover"
                  }
                  decoding="async"
                />
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-slate-900 to-black opacity-70 hover:opacity-50 transition-all ease-in-out" />
              <h3 className="text-3xl font-bold color-white z-10 relative m-0 mt-4 ml-4 pointer-events-none">
                VSCode
              </h3>
            </a>
            <div className="grid gap-8 sm:grid-cols-2 grid-cols-1">
              {extensions.map((extension, idx) => {
                return (
                  <a
                    href={extension.url}
                    target="_blank"
                    className="transform transition-transform duration-300 hover:scale-105 block no-underline rounded-md bg-slate-900 opacity-80 hover:opacity-100 p-4"
                    key={idx}
                  >
                    <h3 className="p-0 m-0 font-bold text-gray-300 text-sm">
                      {extension.name}
                    </h3>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <h2 className="pl-2 text-4xl font-bold mb-8">Font</h2>
          <a
            href="https://github.com/tonsky/FiraCode"
            target="_blank"
            className="transform transition-transform duration-300 hover:scale-105 py-12 block no-underline rounded-md bg-slate-900 text-gray-200"
          >
            <h5 className="font-family-fira no-underline m-0 mb-4 text-center text-4xl">
              Fira Code
            </h5>
            <p className="font-family-fira text-center m-0">
              The quick brown fox jumps over the lazy dog
            </p>
          </a>
        </div>
      </div>
    </>
  );
}
