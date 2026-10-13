"use client";

import { useEffect, useMemo, useState } from "react";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}
function clamp255(n: number) {
  return Math.max(0, Math.min(255, n));
}

type Options = {
  sampleSize?: number; // small canvas size for speed (default 40)
  centerRatio?: number; // 0.3 means sample center 30% area (default 0.3)
  fallback?: string; // "r g b"

  // NEW: vibrance controls
  saturationBoost?: number; // 0.0..1.0 (default 0.35)
  lightnessBoost?: number; // -1.0..1.0 (default 0.10)
  contrastBoost?: number; // 0.0..1.0 (default 0.12)

  // NEW: gradient controls
  gradientAngle?: number; // degrees (default 135)
  hueShift?: number; // degrees for middle stop (default 28)
};

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  s = clamp01(s);
  l = clamp01(l);

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let rp = 0,
    gp = 0,
    bp = 0;

  if (h < 60) [rp, gp, bp] = [c, x, 0];
  else if (h < 120) [rp, gp, bp] = [x, c, 0];
  else if (h < 180) [rp, gp, bp] = [0, c, x];
  else if (h < 240) [rp, gp, bp] = [0, x, c];
  else if (h < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];

  const r = clamp255(Math.round((rp + m) * 255));
  const g = clamp255(Math.round((gp + m) * 255));
  const b = clamp255(Math.round((bp + m) * 255));

  return { r, g, b };
}

function applyContrast(r: number, g: number, b: number, amount: number) {
  // amount 0..1 ; 0 = no change
  // Simple contrast around midpoint 128.
  const factor = 1 + amount * 0.8;
  const adj = (v: number) => clamp255(Math.round((v - 128) * factor + 128));
  return { r: adj(r), g: adj(g), b: adj(b) };
}

function enhanceVibrance(
  r: number,
  g: number,
  b: number,
  saturationBoost: number,
  lightnessBoost: number,
  contrastBoost: number,
) {
  // 1) HSL boost (saturation + lightness)
  const hsl = rgbToHsl(r, g, b);

  // push saturation upward, but keep it natural (soft cap)
  const s = clamp01(hsl.s + saturationBoost * (1 - hsl.s));

  // gently lift lightness (or lower if negative)
  const l = clamp01(hsl.l + lightnessBoost);

  let rgb = hslToRgb(hsl.h, s, l);

  // 2) contrast bump in RGB for extra “pop”
  rgb = applyContrast(rgb.r, rgb.g, rgb.b, contrastBoost);

  return rgb;
}

export function useCenterImageColor(
  url?: string,
  {
    sampleSize = 40,
    centerRatio = 0.3,
    fallback = "255 46 23",
    saturationBoost = 0.35,
    lightnessBoost = 0.1,
    contrastBoost = 0.12,
    gradientAngle = 135,
    hueShift = 28,
  }: Options = {},
) {
  const [baseRgb, setBaseRgb] = useState(fallback); // "r g b"

  useEffect(() => {
    if (!url) return;
    let cancelled = false;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        canvas.width = sampleSize;
        canvas.height = sampleSize;

        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

        const box = Math.max(2, Math.round(sampleSize * centerRatio));
        const start = Math.floor((sampleSize - box) / 2);

        const { data } = ctx.getImageData(start, start, box, box);

        let r = 0,
          g = 0,
          b = 0,
          count = 0;

        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          if (a < 10) continue;

          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }

        if (!count) return;

        r = clamp255(Math.round(r / count));
        g = clamp255(Math.round(g / count));
        b = clamp255(Math.round(b / count));

        if (!cancelled) setBaseRgb(`${r} ${g} ${b}`);
      } catch {
        if (!cancelled) setBaseRgb(fallback);
      }
    };

    img.onerror = () => {
      if (!cancelled) setBaseRgb(fallback);
    };

    img.src = url;

    return () => {
      cancelled = true;
    };
  }, [url, sampleSize, centerRatio, fallback]);

  // Build vibrant + gradient from the sampled color
  const palette = useMemo(() => {
    const parts = baseRgb.trim().split(/\s+/).map(Number);
    const [r0, g0, b0] = [
      clamp255(parts[0] ?? 255),
      clamp255(parts[1] ?? 46),
      clamp255(parts[2] ?? 23),
    ];

    const c1 = enhanceVibrance(
      r0,
      g0,
      b0,
      saturationBoost,
      lightnessBoost,
      contrastBoost,
    );

    // middle stop: hue-shifted cousin (more “gradienty” but still related)
    const hsl1 = rgbToHsl(c1.r, c1.g, c1.b);
    const c2 = hslToRgb(hsl1.h + hueShift, clamp01(hsl1.s * 1.02), hsl1.l);

    // end stop: slightly darker for depth
    const c3 = hslToRgb(hsl1.h - 10, hsl1.s, clamp01(hsl1.l - 0.12));

    const vibrantRgb = `${c1.r} ${c1.g} ${c1.b}`;
    const gradient = `linear-gradient(${gradientAngle}deg, rgb(${c1.r} ${c1.g} ${c1.b}) 0%, rgb(${c2.r} ${c2.g} ${c2.b}) 55%, rgb(${c3.r} ${c3.g} ${c3.b}) 100%)`;

    return { baseRgb, vibrantRgb, gradient };
  }, [
    baseRgb,
    saturationBoost,
    lightnessBoost,
    contrastBoost,
    gradientAngle,
    hueShift,
  ]);

  return palette;
}
