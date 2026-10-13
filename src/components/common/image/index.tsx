"use client";

import { cn } from "@/utils/helpers/cn";
import Image, { ImageProps, StaticImageData } from "next/image";
import { useState } from "react";
import imagePlaceholder from "./img-placeholder.png";

type Props = Omit<ImageProps, "src"> & {
  src?: string | StaticImageData;
  fallbackSrc?: string | StaticImageData;
  fallbackText?: string;
  className?: string;
};

export const DEFAULT_IMAGE: StaticImageData | string = imagePlaceholder;

function srcKey(v?: string | StaticImageData) {
  if (!v) return "";
  return typeof v === "string" ? v : v.src; // StaticImageData has .src
}

function InnerImage({
  initialSrc,
  fallbackSrc,
  fallbackText,
  alt,
  className = "",
  ...props
}: {
  initialSrc: string | StaticImageData;
  fallbackSrc?: string | StaticImageData;
  fallbackText?: string;
} & Omit<ImageProps, "src">) {
  const [imgSrc, setImgSrc] = useState<string | StaticImageData>(initialSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else if (imgSrc !== DEFAULT_IMAGE) {
      setImgSrc(DEFAULT_IMAGE);
    } else {
      setHasError(true);
    }
  };

  if (hasError && fallbackText) {
    return (
      <div className="flex items-center justify-center w-full h-full text-gray-500 text-sm">
        {fallbackText}
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt || "..."}
      onError={handleError}
      // Most callers size the image with CSS and leave width/height at the
      // placeholder 100, so without `sizes` Next would only offer a 1x/2x
      // (128/256px) srcset. Default to the viewport width; pass a tighter
      // `sizes` where the rendered width is known.
      sizes={props.fill || props.sizes ? props.sizes : "100vw"}
      width={props.width ?? 100}
      height={props.height ?? 100}
      className={cn("w-full object-cover", className)}
      {...props}
    />
  );
}

export default function ImageComponent({ src, fallbackSrc, ...props }: Props) {
  const initialSrc = src ?? fallbackSrc ?? DEFAULT_IMAGE;

  // when src/fallbackSrc changes, remount InnerImage => state resets
  const key = `${srcKey(src)}|${srcKey(fallbackSrc)}`;

  return (
    <InnerImage
      key={key}
      initialSrc={initialSrc}
      fallbackSrc={fallbackSrc}
      {...props}
    />
  );
}
