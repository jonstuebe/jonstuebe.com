import { FC } from "react";

declare module "react" {
  interface HTMLAttributes<T> {
    tw?: string;
  }
}

export interface SocialCardProps {
  title: string;
  image?: string;
  imageDescription?: string;
  className?: string;
  readingTime?: string;
}

export const SocialCard: FC<SocialCardProps> = ({
  title,
  image,
  imageDescription = "",
  className = "",
  readingTime,
}) => {
  return (
    <div
      tw={
        "flex w-full h-full rounded-md bg-gray-800 overflow-hidden relative flex items-center justify-center" +
        " " +
        className
      }
    >
      {image ? (
        <div tw="flex absolute absolute-center w-full h-full object-fit">
          <img
            src={image}
            alt={imageDescription}
            tw="absolute w-full h-full absolute-center object-fit"
          />
        </div>
      ) : null}
      <div tw="bg-black opacity-50 w-full h-full absolute absolute-center pointer-events-none"></div>
      <div tw="opacity-20 bg-gradient-to-t from-black via-black to-transparent w-full h-1/2 absolute bottom-0 left-0 pointer-events-none"></div>
      <h2 tw="relative text-white text-[12rem] leading-none tracking-tight text-center select-none w-3/4">
        {title}
      </h2>
      <h3 tw="absolute m-0 p-0 text-6xl text-white opacity-80 bottom-14 left-8">
        Jon Stuebe
      </h3>
      {readingTime ? (
        <h3 tw="absolute m-0 p-0 text-white opacity-80 text-6xl bottom-14 right-8">
          {readingTime}
        </h3>
      ) : null}
    </div>
  );
};
