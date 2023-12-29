import { Link } from "@remix-run/react";
import { createCacheHeader } from "../utils/cache";

export const headers = createCacheHeader({ stale: "1month" });

export default function Grow() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full h-full m-auto relative">
      <img
        src="/apps/grow/logomark.svg"
        width={60}
        className="motion-safe:animate-water-drop motion-safe:opacity-0 mb-2"
      />
      <h1 className="motion-safe:animate-fade-in-slow motion-safe:opacity-0 m-0 mb-2">
        Grow
      </h1>
      <p className="text-center text-gray-400 text-md motion-safe:animate-fade-in-slow m-0 mb-8">
        An app to track your goals
      </p>
      {/* <a
        href="https://apps.apple.com/us/app/grow-tracker/id1577232272"
        target="_blank"
        className="motion-safe:animate-fade-in-slow mb-4"
      >
        <img src="/app-store.svg" width={120} />
      </a> */}
      <div className="flex flex-row justify-center gap-4 motion-safe:animate-fade-in-slow">
        <Link
          to="/apps/grow/support"
          className="text-xs text-gray-500 no-underline"
        >
          support
        </Link>
        <Link
          to="/apps/grow/privacy-policy"
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
