"use client";

import { useLayoutEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { HeadingOne, HeadingTwo } from "./Heading";
import { cn } from "@/utils/helpers/cn";
import decodeHtmlEntities from "@/utils/helpers/decodeHtmlEntities";
import { useNearViewport } from "@/hooks/useNearViewport";

gsap.registerPlugin(SplitText);

type HighlightHeadingProps = {
  tag?: "h1" | "h2";
  text?: string;
  highlight?: string | string[];
  highlightClassName?: string;
  className?: string;
  animate?: boolean;
  [key: string]: any;
};

const emptySubscribe = () => () => {};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Wraps every `words` match in a highlight span. Input is plain text. */
const buildHighlightedHtml = (
  plain: string,
  words: string[],
  highlightClassName: string,
) => {
  if (words.length === 0) return escapeHtml(plain);

  const pattern = new RegExp(`(${words.map(escapeRegExp).join("|")})`, "gi");

  return plain
    .split(pattern)
    .map((chunk) => {
      if (!chunk) return "";

      const isMatch = words.some(
        (word) => word.toLowerCase() === chunk.toLowerCase(),
      );

      return isMatch
        ? `<span class="${escapeHtml(highlightClassName)}">${escapeHtml(chunk)}</span>`
        : escapeHtml(chunk);
    })
    .join("");
};

export const HighlightHeading = ({
  tag = "h2",
  text,
  highlight,
  highlightClassName = "!text-primary",
  className,
  animate = true,
  ...props
}: HighlightHeadingProps) => {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const contentRef = useRef<HTMLSpanElement | null>(null);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // SplitText forces layout, so splitting every heading during hydration is
  // costly. Split only once the heading is within half a viewport of the
  // screen - still off-screen, so the hidden initial state never flashes.
  const isNearViewport = useNearViewport(headingRef, animate);

  const words = (Array.isArray(highlight) ? highlight : [highlight]).filter(
    Boolean,
  ) as string[];

  // A single HTML string is the whole rendered content. React writes it with
  // `dangerouslySetInnerHTML`, which means it never tracks the nodes inside -
  // so SplitText is free to rewrite them without React losing its place.
  const html = !text
    ? ""
    : text.includes("<")
      ? // CMS titles arrive as markup (inline colour spans); render them as-is.
        decodeHtmlEntities(text)
      : buildHighlightedHtml(
          decodeHtmlEntities(text),
          words,
          highlightClassName,
        );

  useLayoutEffect(() => {
    const content = contentRef.current;

    if (!isMounted || !html || !content) return;

    // SplitText replaces the content and restores its own snapshot on revert,
    // so re-assert the current markup before every split. Without this, a
    // revert triggered by a `text` change puts the previous title back after
    // React has already written the new one.
    content.innerHTML = html;

    if (!animate || !isNearViewport) return;

    // Accessible name for the split heading. SplitText's default `aria:
    // "auto"` puts aria-label on the inner <span>, which is not allowed on an
    // element without a role; put it on the heading instead and hide the
    // per-letter spans from assistive tech.
    const heading = headingRef.current;
    heading?.setAttribute("aria-label", (content.textContent || "").trim());
    content.setAttribute("aria-hidden", "true");

    const split = new SplitText(content, {
      type: "chars,words,lines",
      linesClass: "split-line",
      charsClass: "hh-char",
      aria: "none",
    });

    // The letter animation is a CSS transition (globals.css, `.hh-split`).
    // Animating each char with GSAP read every char's computed transform
    // right after writing the previous one - a forced layout per letter.
    // Here JS only writes: a stagger index per char, then one attribute.
    split.chars.forEach((char, index) => {
      (char as HTMLElement).style.setProperty("--hh-i", String(index));
    });
    content.classList.add("hh-split");

    // Play once the heading's top passes 85% of the viewport height, or
    // straight away if the page is already scrolled past it.
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
        observer.disconnect();
        // Let the hidden state paint first so the transition always runs.
        frame = requestAnimationFrame(() =>
          content.setAttribute("data-hh-visible", ""),
        );
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    if (heading) observer.observe(heading);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      split.revert();
      content.classList.remove("hh-split");
      content.removeAttribute("data-hh-visible");
      heading?.removeAttribute("aria-label");
      content.removeAttribute("aria-hidden");
    };
  }, [isMounted, html, animate, isNearViewport]);

  if (!text) return null;

  const HeadingComponent = tag === "h1" ? HeadingOne : HeadingTwo;

  return (
    <HeadingComponent
      ref={headingRef}
      className={cn(
        "font-heading text-[clamp(2rem,3.958vw,4.00rem)] leading-[110%]",
        className,
      )}
      {...props}
    >
      <span ref={contentRef} dangerouslySetInnerHTML={{ __html: html }} />
    </HeadingComponent>
  );
};
