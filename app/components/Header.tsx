import { Link } from "@remix-run/react";

export function Header() {
  return (
    <header className="flex justify-between items-center py-4">
      <Link className="text-white no-underline select-none" to="/">
        <h2 className="font-bold text-2xl">Jon Stuebe</h2>
      </Link>
      <nav className="flex space-x-4">
        <Link
          className="text-base text-gray-400 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md font-medium no-underline select-none"
          to="/blog"
          prefetch="render"
        >
          blog
        </Link>
        <Link
          className="text-base text-gray-400 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md font-medium no-underline select-none"
          to="/notes"
          prefetch="render"
        >
          notes
        </Link>
        <Link
          className="text-base text-gray-400 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md font-medium no-underline select-none"
          to="/music"
          prefetch="render"
        >
          music
        </Link>
      </nav>
    </header>
  );
}
