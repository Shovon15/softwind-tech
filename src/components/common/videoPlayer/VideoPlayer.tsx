"use client";

import React, { useState } from "react";
import { cn } from "@/utils/helpers/cn";
import { getVideoType } from "@/utils/helpers/getVideoType";

type VideoPlayerProps = {
  videoUrl?: string;
  poster?: string; // fallback image while loading / if error
  muted?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  playsInline?: boolean;
  preload?: "none" | "metadata" | "auto";
  className?: string; // container styles
  videoClassName?: string; // video styles
  children?: React.ReactNode; // overlay content if needed
};

const VideoPlayer = ({
  videoUrl,
  poster,
  muted = true,
  loop = true,
  autoPlay = true,
  playsInline = true,
  preload = "auto",
  className,
  videoClassName,
  children,
}: VideoPlayerProps) => {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  const showVideo = !!videoUrl && !hasVideoError;

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {/* Poster fallback (also stays if video errors) */}
      {poster && (
        <div
          className={cn(
            "absolute inset-0 bg-center bg-cover transition-opacity duration-500",
            showVideo && isVideoReady ? "opacity-0" : "opacity-100",
          )}
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}

      {/* Video */}
      {showVideo && (
        <video
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
            isVideoReady ? "opacity-100" : "opacity-0",
            videoClassName,
          )}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          autoPlay={autoPlay}
          preload={preload}
          poster={poster}
          onLoadedData={() => setIsVideoReady(true)}
          onError={() => setHasVideoError(true)}
        >
          <source src={videoUrl} type={getVideoType(videoUrl)} />
        </video>
      )}

      {/* Optional overlay content */}
      {children ? <div className="relative z-10">{children}</div> : null}
    </div>
  );
};

export default VideoPlayer;
