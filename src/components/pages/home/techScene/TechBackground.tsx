"use client";

import { useEffect, useRef } from "react";
import type { TechScene } from "./createTechScene";

/**
 * Fixed full-screen WebGL network globe behind the home page.
 * three.js is code-split and only loaded once the browser is idle, so it never
 * competes with the first paint or the hero intro animation.
 */
const TechBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let scene: TechScene | null = null;
    let cancelled = false;

    const init = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        const { createTechScene } = await import("./createTechScene");
        if (cancelled) return;
        scene = createTechScene(canvas, {
          reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches,
        });
      } catch {
        // No WebGL: the page still works, just without the 3D background
      }
    };

    // Safari has no requestIdleCallback
    const hasIdle = typeof window.requestIdleCallback === "function";
    const handle = hasIdle
      ? window.requestIdleCallback(init, { timeout: 1500 })
      : setTimeout(init, 600);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(handle as number);
      else clearTimeout(handle);
      scene?.dispose();
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* Vignette keeps text readable over the scene */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(8,18,18,0.75)_100%)]" />
    </div>
  );
};

export default TechBackground;
