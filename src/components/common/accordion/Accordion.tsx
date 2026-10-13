"use client";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import SafeHtml from "../safeHtml";

gsap.registerPlugin(useGSAP);

type Props = {
  items: IFaqItem[];
  defaultOpenFirst?: boolean;
  tag?: "h2" | "h3" | "h4";
};

export function Accordion({
  items,
  defaultOpenFirst = true,
  tag = "h2",
}: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(
    defaultOpenFirst ? 0 : null,
  );

  return (
    <div className="columns-1 lg:columns-2 gap-3 w-full">
      {items.map((item, index) => (
        <FaqRow
          key={index}
          item={item}
          active={activeIndex === index}
          tag={tag}
          onToggle={() =>
            setActiveIndex((prev) => (prev === index ? null : index))
          }
        />
      ))}
    </div>
  );
}

function FaqRow({
  item,
  active,
  onToggle,
  tag = "h2",
}: {
  item: IFaqItem;
  active: boolean;
  onToggle: () => void;
  tag?: "h2" | "h3" | "h4";
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const iconWrapRef = useRef<HTMLSpanElement>(null);
  const Tag = tag;

  // const { language } = useAppSelector((state) => state.language);

  // The first render already has the right open/closed state in its markup,
  // so tween only on toggles. Tweening every row on mount made GSAP read each
  // row's computed styles right after hydration: a forced layout per row.
  const [initiallyActive] = useState(active);
  const hasMountedRef = useRef(false);

  useGSAP(
    () => {
      if (!hasMountedRef.current) {
        hasMountedRef.current = true;
        return;
      }

      gsap.to(contentRef.current, {
        height: active ? "auto" : 0,
        opacity: active ? 1 : 0,
        marginTop: active ? "1rem" : 0,
        duration: 0.3,
        ease: "power2.inOut",
      });

      // Rotate the chevron to indicate the open state.
      gsap.to(iconWrapRef.current, {
        rotate: active ? 180 : 0,
        transformOrigin: "50% 50%",
        duration: 0.3,
        ease: "power2.inOut",
      });
    },
    { dependencies: [active] },
  );

  return (
    <div className="break-inside-avoid mb-3 rounded-xl bg-[#F3F3F3] px-4 py-4 transition lg:py-5">
      <button
        type="button"
        aria-expanded={active}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
      >
        <Tag className="font-body text-sm font-medium text-[#151515] lg:text-base">
          {item.question}
        </Tag>

        <span
          ref={iconWrapRef}
          aria-hidden
          className="relative ml-auto inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center"
          style={initiallyActive ? { transform: "rotate(180deg)" } : undefined}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 7L10 13L16 7"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div
        ref={contentRef}
        className={
          initiallyActive ? "mt-4 overflow-hidden" : "h-0 overflow-hidden opacity-0"
        }
      >
        <div className="font-body text-sm font-normal leading-relaxed text-[#666666] whitespace-pre-line lg:text-base ">
          <SafeHtml content={item.answer} />
        </div>
      </div>
    </div>
  );
}
