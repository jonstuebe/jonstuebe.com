import { FC, useMemo } from "react";
import { BlurhashCanvas } from "react-blurhash";

export type Sizes = { minWidth: number; width: number }[];
export type SrcSet = { src: string; width: number }[];

export interface ImageProps {
  src: string;
  unsplash?: boolean;
  blurhash: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
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

function getImage(id: string, width: number, height: number) {
  return `https://source.unsplash.com/${id}/${width}x${height}`;
}

function getImageProps(
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
        src: getImage(id, width, Math.round(width / ratio)),
        width,
      };
    })
  );

  return {
    sizes,
    srcset,
  };
}

export const Image: FC<ImageProps> = ({
  src,
  unsplash = true,
  blurhash,
  alt,
  className,
  imageClassName = "object-fit",
  imageSizes,
}) => {
  const { srcset, sizes } = useMemo(() => {
    if (!unsplash) {
      const sizes = imageToSizes(imageSizes);
      const srcset = imageToSrcset(
        imageSizes.map(({ width }) => {
          return {
            src,
            width,
          };
        })
      );

      return {
        srcset,
        sizes,
      };
    }

    return getImageProps(src, imageSizes);
  }, [src]);

  return (
    <div className={className}>
      <BlurhashCanvas
        hash={blurhash}
        className={"absolute w-full h-full absolute-center"}
      />
      <img
        src={src}
        srcSet={srcset}
        alt={alt}
        sizes={sizes}
        className={
          "absolute w-full h-full absolute-center" + " " + imageClassName
        }
        decoding="async"
      />
    </div>
  );
};