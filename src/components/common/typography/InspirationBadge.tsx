"use client";

import React, { useLayoutEffect, useRef } from "react";
import { cn } from "@/utils/helpers/cn";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";

type InspirationBadgeProps = {
  topText: string;
  bottomText: string;
  tag?: HeadingTag;
  className?: string;
  topClassName?: string;
  bottomClassName?: string;
} & React.HTMLAttributes<HTMLElement>;

export default function InspirationBadge({
  topText,
  bottomText,
  tag = "div",
  className,
  topClassName,
  bottomClassName,
  ...props
}: InspirationBadgeProps) {
  const Comp = tag;
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const topEl = rootRef.current?.querySelector('[data-split="top"]');
      const bottomEl = rootRef.current?.querySelector('[data-split="bottom"]');
      if (!topEl || !bottomEl) return;

      const topSplit = SplitText.create(topEl, {
        type: "chars",
        linesClass: "split-line",
      });

      const bottomSplit = SplitText.create(bottomEl, {
        type: "chars",
        linesClass: "split-line",
      });

      gsap.set([...topSplit.chars, ...bottomSplit.chars], {
        y: 16,
        autoAlpha: 0,
      });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 85%",
          once: true,
          onEnter: () => tl.play(),
        },
      });

      tl.to(topSplit.chars, {
        y: 0,
        autoAlpha: 1,
        stagger: 0.02,
        duration: 0.45,
      }).to(
        bottomSplit.chars,
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.02,
          duration: 0.45,
        },
        "-=0.25",
      );

      return () => {
        tl.scrollTrigger?.kill();
        topSplit.revert();
        bottomSplit.revert();
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <Comp
      ref={rootRef as any}
      className={cn(
        // badge container
        "relative inline-block overflow-hidden",
        "px-6 py-4 md:px-8 md:py-5",
        "bg-[#0b0b0b]",
        "shadow-[0_10px_28px_rgba(0,0,0,0.45)]",
       
        // diagonal red corner (bottom-right)
        "after:content-[''] after:absolute after:bottom-0 after:right-0 after:pointer-events-none",
        "after:w-16 after:h-10 md:after:w-20 md:after:h-12",
        "after:bg-[#F73219]",
        "after:[clip-path:polygon(45%_100%,100%_0,100%_100%)]",
        className,
      )}
      {...props}
    >
      <span
        data-split="top"
        className={cn(
          "block uppercase font-boldCond leading-none",
          "text-[#F73219]",
          "text-[clamp(18px,1.6vw,28px)]",
          topClassName,
        )}
      >
        {topText}
      </span>

      <span
        data-split="bottom"
        className={cn(
          "block uppercase font-boldCond leading-none",
          "text-[#8A8A8A]",
          "text-[clamp(22px,2.1vw,34px)]",
          bottomClassName,
        )}
      >
        {bottomText}
      </span>
    </Comp>
  );
}
