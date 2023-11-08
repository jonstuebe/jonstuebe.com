import { Link } from "@remix-run/react";
import { createCacheHeader } from "../utils/cache";

export const headers = createCacheHeader({ stale: "1month" });

export default function Quench() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full h-full m-auto relative">
      <img
        src="/logomark.svg"
        width={40}
        className="motion-safe:animate-water-drop motion-safe:opacity-0 mb-2"
      />
      <h1 className="motion-safe:animate-fade-in-slow motion-safe:opacity-0 m-0 mb-2">
        Quench
      </h1>
      <p className="text-center text-gray-400 text-md motion-safe:animate-fade-in-slow m-0 mb-8">
        A simple water tracking app
      </p>
      <a
        href="https://apps.apple.com/us/app/quench-tracker/id1577232272"
        target="_blank"
        className="motion-safe:animate-fade-in-slow mb-4"
      >
        <img src="/app-store.svg" width={120} />
      </a>
      <div className="flex flex-row justify-center gap-4 motion-safe:animate-fade-in-slow">
        <Link
          to="/apps/quench/support"
          className="text-xs text-gray-500 no-underline"
        >
          support
        </Link>
        <Link
          to="/apps/quench/privacy-policy"
          className="text-xs text-gray-500 no-underline"
        >
          privacy policy
        </Link>
      </div>
      <h2 className="absolute bottom-0 left-0 w-full text-center text-base text-gray-500 font-medium pb-4">
        &copy; {new Date().getFullYear()} Jon Stuebe
      </h2>
    </div>
  );
}
