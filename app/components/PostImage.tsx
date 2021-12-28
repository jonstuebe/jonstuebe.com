import { FC } from "react";
import { UnsplashImage } from "./UnplashImage";

export const PostImage: FC<{ image: string; blurhash: string }> = ({
  image,
  blurhash,
}) => {
  return (
    <div className="absolute top-0 left-0 z-0 w-full h-96 motion-safe:animate-fade-in-slow">
      <UnsplashImage
        blurhash={blurhash}
        src={image}
        imageSizes={[
          { minWidth: 2000, width: 1800 },
          { minWidth: 1500, width: 1200 },
          { minWidth: 1200, width: 1000 },
          { minWidth: 800, width: 700 },
          { minWidth: 500, width: 400 },
          { minWidth: 320, width: 250 },
        ]}
        className="z-0 w-full h-96"
        imageClassName="object-cover"
        alt="post image"
      />
      <div className="absolute bottom-0 left-0 z-10 w-full h-full bg-gradient-to-t from-black to-transparent" />
      <div className="absolute top-0 left-0 z-10 w-full h-full bg-gradient-to-b from-black to-transparent" />
    </div>
  );
};
