import { FC, useMemo } from "react";

export type Sizes = { minWidth: number; width: number }[];
export type SrcSet = { src: string; width: number }[];

export interface UnsplashImageProps {
  src: string;
  alt?: string;
  className?: string;
  imageSizes: Sizes;
}

function imageToSizes(sizes: Sizes) {
  return (
    sizes
      .map((size) => {
        return `(min-width: ${size.minWidth}px) ${size.width}px`;
      })
      .join(", ") + ", 100vw"
  );
}

function imageToSrcset(srcset: SrcSet) {
  return srcset
    .map(({ src, width }) => {
      return `${src} ${width}w`;
    })
    .join(", ");
}

function getUnsplashImage(id: string, width: number, height: number) {
  return `https://source.unsplash.com/${id}/${width}x${height}`;
}

function unsplashToImageProps(
  src: string,
  sizesArr: Sizes
): {
  srcset: string;
  sizes: string;
} {
  const url = new URL(src);

  const [, id, dimensions] = url.pathname.split("/");
  const [width, height] = dimensions.split("x").map(Number);

  const ratio = width / height;
  const sizes = imageToSizes(sizesArr);
  const srcset = imageToSrcset(
    sizesArr.map(({ width }) => {
      return {
        src: getUnsplashImage(id, width, Math.round(width / ratio)),
        width,
      };
    })
  );

  return {
    sizes,
    srcset,
  };
}

export const UnsplashImage: FC<UnsplashImageProps> = ({
  src,
  alt,
  className,
  imageSizes,
}) => {
  const { srcset, sizes } = useMemo(() => {
    return unsplashToImageProps(src, imageSizes);
  }, [src]);

  return (
    <img
      src={src}
      srcSet={srcset}
      alt={alt}
      sizes={sizes}
      className={className}
      decoding="async"
    />
  );
};
