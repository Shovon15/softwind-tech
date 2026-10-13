"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/utils/helpers/cn";
import decodeHtmlEntities from "@/utils/helpers/decodeHtmlEntities";
import { scheduleScrollTriggerRefresh } from "@/utils/helpers/scheduleScrollTriggerRefresh";
import { useNearViewport } from "@/hooks/useNearViewport";

gsap.registerPlugin(SplitText, ScrollTrigger);

type Props = {
  content?: string;
  className?: string;
  animate?: boolean;
  [key: string]: any;
};

const emptySubscribe = () => () => {};

const Paragraph = ({
  content = "",
  className,
  animate = true,
  ...props
}: Props) => {
  const pRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(!animate);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // Defer the (layout-forcing) SplitText until the paragraph is within half a
  // viewport of the screen; it stays `invisible` until then, as before.
  const isNearViewport = useNearViewport(pRef, animate);

  useLayoutEffect(() => {
    if (!animate || !pRef.current || !content || !isMounted) {
      setIsReady(true);
      return;
    }

    if (!isNearViewport) return;

    setIsReady(false);
    let rafId = 0;

    const ctx = gsap.context(() => {
      SplitText.create(pRef.current, {
        type: "lines",
        // Whole lines read naturally; the default "auto" would add aria-label
        // to this <div>, which is not allowed on an element without a role.
        aria: "none",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          gsap.set(self.lines, { y: 30, autoAlpha: 0 });
          setIsReady(true);

          const tween = gsap.to(self.lines, {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: pRef.current,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
          });

          // On client-side navigation there is no `window.load` event (which
          // is what auto-refreshes ScrollTrigger on a full reload), so the
          // trigger is created against a not-yet-settled layout and may never
          // fire. Refresh after the new route paints so the animation runs on
          // every navigation as well as on reload.
          rafId = requestAnimationFrame(() => {
            rafId = requestAnimationFrame(() => scheduleScrollTriggerRefresh());
          });

          return tween;
        },
      });
    }, pRef);

    return () => {
      cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, [content, animate, isMounted, isNearViewport]);

  if (!content) return null;

  return (
    <div
      ref={pRef}
      className={cn(
        "font-dmSans font-[300] text-white py-5 text-[clamp(14px,1.2vw,16px)] leading-[clamp(20px,1.6vw,26px)] ",
        !isReady && "invisible",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(content) }}
      {...props}
    />
  );
};

export default Paragraph;
