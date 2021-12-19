import { FC } from "react";
import { UnsplashImage } from "./UnplashImage";

export const PostImage: FC<{ image: string }> = ({ image }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-96 z-0 motion-safe:animate-fade-in-slow">
      <UnsplashImage
        src={image}
        imageSizes={[
          { minWidth: 2000, width: 1800 },
          { minWidth: 1500, width: 1200 },
          { minWidth: 1200, width: 1000 },
          { minWidth: 800, width: 700 },
          { minWidth: 500, width: 400 },
          { minWidth: 320, width: 250 },
        ]}
        className="z-0 w-full h-96 object-cover"
        alt="post image"
      />
      <div className="w-full h-full z-10 absolute bottom-0 left-0 bg-gradient-to-t from-black to-transparent" />
      <div className="w-full h-full z-10 absolute top-0 left-0 bg-gradient-to-b from-black to-transparent" />
    </div>
  );
};
