import { useState, useCallback, useEffect } from "react";
import { Transition } from "@headlessui/react";

export function BackToTop() {
	const [showScrollToTop, setShowScrollToTop] = useState(false);

	const checkScrollTop = useCallback(() => {
		if (!showScrollToTop && window.pageYOffset > 400) {
			setShowScrollToTop(true);
		} else if (showScrollToTop && window.pageYOffset <= 400) {
			setShowScrollToTop(false);
		}
	}, [showScrollToTop]);

	const onScrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	useEffect(() => {
		window.addEventListener("scroll", checkScrollTop);

		return () => {
			window.removeEventListener("scroll", checkScrollTop);
		};
	}, [checkScrollTop]);

	return (
		<Transition
			show={showScrollToTop}
			enter="transition ease-out duration-100 motion-safe:transform"
			enterFrom="opacity-0 scale-60 translate-y-4"
			enterTo="opacity-100 scale-100 translate-y-0"
			leave="transition ease-in duration-75 motion-safe:transform"
			leaveFrom="opacity-100 scale-100 translate-y-0"
			leaveTo="opacity-0 scale-60 translate-y-4"
		>
			{(ref) => (
				<button
					ref={ref}
					onClick={onScrollToTop}
					className="w-8 h-8 fixed bottom-4 right-4 p-0 bg-transparent appearance-none border-none"
					aria-label="back to top"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						className="w-8 h-8 text-gray-400"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 11l7-7 7 7M5 19l7-7 7 7"
						/>
					</svg>
				</button>
			)}
		</Transition>
	);
}
