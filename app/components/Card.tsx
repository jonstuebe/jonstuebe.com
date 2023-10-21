import { FC, PropsWithChildren } from "react";

export interface CardProps {
  title: string;
  image: string;
  imageDescription?: string;
  className?: string;
}

export const Card: FC<PropsWithChildren<CardProps>> = ({
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
      <div className="absolute w-full h-full absolute-center">
        <img
          src={image}
          alt={imageDescription}
          className={"absolute w-full h-full absolute-center object-fit"}
          decoding="async"
        />
      </div>

      <div className="absolute w-full h-full bg-black opacity-50 pointer-events-none absolute-center"></div>
      <div className="absolute bottom-0 left-0 w-full pointer-events-none opacity-20 bg-gradient-to-t from-black via-black to-transparent h-1/2"></div>
      <h2 className="relative font-semibold w-3/4 text-4xl leading-none tracking-tight text-center text-white select-none">
        {title}
      </h2>
      {children}
    </div>
  );
};
