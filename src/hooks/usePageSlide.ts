"use client";

import { useCallback, useState } from "react";
import { gsap } from "gsap";

export type SlideDirection = "left" | "right" | "up" | "down";

type Options = {
  duration?: number;
  ease?: string;
  fade?: boolean;
};

export function usePageSlide<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  direction: SlideDirection = "right",
  options: Options = {},
) {
  const [isAnimating, setIsAnimating] = useState(false);

  const playExit = useCallback(
    (onComplete?: () => void) => {
      if (isAnimating) return;

      const el = ref.current;
      if (!el) {
        onComplete?.();
        return;
      }

      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

      if (reduce) {
        onComplete?.();
        return;
      }

      setIsAnimating(true);

      const vars: gsap.TweenVars = {
        duration: options.duration ?? 0.55,
        ease: options.ease ?? "power3.inOut",
        onComplete: () => {
          setIsAnimating(false);
          onComplete?.();
        },
      };

      if (options.fade ?? true) vars.autoAlpha = 0;

      switch (direction) {
        case "left":
          vars.xPercent = -100;
          break;
        case "right":
          vars.xPercent = 100;
          break;
        case "up":
          vars.yPercent = -100;
          break;
        case "down":
          vars.yPercent = 100;
          break;
      }

      gsap.to(el, vars);
    },
    [ref, direction, options.duration, options.ease, options.fade, isAnimating],
  );

  return { playExit, isAnimating };
}
