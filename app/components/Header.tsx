import { Link } from "remix";

export function Header() {
	return (
		<header className="flex justify-between items-center">
			<Link className="text-white no-underline select-none" to="/">
				<h2 className="">Jon Stuebe</h2>
			</Link>
			<nav className="flex space-x-4">
				<Link
					className="hidden md:inline-flex text-base text-gray-400 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md font-medium no-underline select-none"
					to="/"
				>
					home
				</Link>

				<Link
					className="text-base text-gray-400 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md font-medium no-underline select-none"
					to="/blog"
				>
					blog
				</Link>

				<Link
					className="text-base text-gray-400 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md font-medium no-underline select-none"
					to="/notes"
				>
					notes
				</Link>
			</nav>
		</header>
	);
}
