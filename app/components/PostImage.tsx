import { FC } from "react";

export const PostImage: FC<{ image: string }> = ({ image }) => {
  return (
    <div className="absolute top-0 left-0 z-0 w-full h-96 motion-safe:animate-fade-in-slow">
      <div className="z-0 w-full h-96">
        <img
          src={image}
          alt="post image"
          className={"absolute w-full h-full absolute-center object-cover"}
          decoding="async"
        />
      </div>
      <div className="absolute bottom-0 left-0 z-10 w-full h-full bg-gradient-to-t from-black to-transparent" />
      <div className="absolute top-0 left-0 z-10 w-full h-full bg-gradient-to-b from-black to-transparent" />
    </div>
  );
};
