import { FC } from "react";

export const PostImage: FC<{ image: string }> = ({ image }) => {
	return (
		<div className="absolute top-0 left-0 w-full h-96 z-0 motion-safe:animate-fade-in-slow">
			<img
				src={image}
				// layout="fill"
				className="z-0 w-full h-96 object-cover"
				alt="post image"
			/>
			<div className="w-full h-full z-10 absolute bottom-0 left-0 bg-gradient-to-t from-black to-transparent" />
			<div className="w-full h-full z-10 absolute top-0 left-0 bg-gradient-to-b from-black to-transparent" />
		</div>
	);
};
