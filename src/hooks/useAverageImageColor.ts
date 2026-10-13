"use client";

import { useEffect, useState } from "react";

function clamp(n: number) {
  return Math.max(0, Math.min(255, n));
}

export function useAverageImageColor(
  url?: string,
  fallback: string = "255 46 23", // default (your red)
) {
  const [rgb, setRgb] = useState<string>(fallback);

  useEffect(() => {
    if (!url) return;

    let cancelled = false;

    const img = new Image();
    // Important for canvas reads (must be allowed by image host)
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        // small sample for speed
        const w = 24;
        const h = 24;
        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);

        let r = 0, g = 0, b = 0, count = 0;

        // sample every pixel (4 bytes per pixel)
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha < 10) continue; // skip transparent
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }

        if (!count) return;

        r = clamp(Math.round(r / count));
        g = clamp(Math.round(g / count));
        b = clamp(Math.round(b / count));

        if (!cancelled) setRgb(`${r} ${g} ${b}`);
      } catch {
        // CORS-tainted canvas or other error -> keep fallback
      }
    };

    img.onerror = () => {
      if (!cancelled) setRgb(fallback);
    };

    img.src = url;

    return () => {
      cancelled = true;
    };
  }, [url, fallback]);

  return rgb; // format: "r g b"
}
