import { FC } from "react";

export interface CardProps {
	title: string;
	image: string;
	imageDescription?: string;
	className?: string;
}

export const Card: FC<CardProps> = ({
	title,
	image,
	imageDescription = "",
	className = "",
	children,
}) => {
	return (
		<div
			className={
				"rounded-md bg-gray-800 md:h-64 sm:h-80 h-64 border border-solid border-gray-700 hover:shadow-sm motion-safe:transition motion-safe:transform hover:scale-105 hover:ring-1 ring-opacity-50 ring-inset ring-blue-400 overflow-hidden relative flex items-center justify-center" +
				" " +
				className
			}
		>
			<img
				src={image}
				alt={imageDescription}
				// layout="fill"
				decoding="async"
				className="absolute absolute-center object-cover"
			/>
			<div className="bg-black opacity-50 w-full h-full absolute absolute-center pointer-events-none"></div>
			<div className="opacity-20 bg-gradient-to-t from-black via-black to-transparent w-full h-1/2 absolute bottom-0 left-0 pointer-events-none"></div>
			<h2 className="relative text-white text-4xl leading-none tracking-tight text-center select-none w-3/4">
				{title}
			</h2>
			{children}
		</div>
	);
};
