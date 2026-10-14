"use client";

import { Fragment, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContentContainer from "@/components/layout/container/contentContainer";
import { cn } from "@/utils/helpers/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// `highlight` segments light up in the primary color instead of the text color
const TITLE: { text: string; highlight?: boolean }[] = [
  { text: "We don't just write code. We become your" },
  { text: "technology partner,", highlight: true },
  {
    text: "turning bold ideas into reliable products with clear communication, honest timelines and engineering that is built to",
  },
  { text: "last.", highlight: true },
];

const WORDS = TITLE.flatMap((segment) =>
  segment.text
    .split(" ")
    .filter(Boolean)
    .map((word) => ({ word, highlight: segment.highlight })),
);

const WhySoftwindTech = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(sectionRef);
      const words = q("[data-word]");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(words, { opacity: 1 });
        return;
      }

      const card = q("[data-card]");
      const content = q("[data-content]");
      const vh = () => window.innerHeight;

      /* ---------- Soft landing: card grows in and content decelerates into the pin ---------- */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top top",
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          card,
          { scale: 0.9, borderRadius: 48 },
          { scale: 1, borderRadius: 0, ease: "power2.out" },
          0,
        )
        // Pushing content down with an ease-in counteracts the upward scroll near the end,
        // so it arrives slowly instead of stopping dead
        .fromTo(
          content,
          { y: () => -vh() * 0.2 },
          { y: 0, ease: "power3.in" },
          0,
        );

      /* ---------- Pinned: words reveal, hold, then ease out into the release ---------- */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${vh() * 4.5}`,
            scrub: 1.2,
            pin: true,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          words,
          { opacity: 0.12, y: "0.15em", filter: "blur(2px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.3,
            ease: "power1.out",
          },
        )
        // Hold so the finished sentence stays readable
        .to({}, { duration: 1.5 })
        // Content starts drifting up before the pin lets go, so the release is gradual
        .to(content, { y: () => -vh() * 0.2, ease: "power3.in", duration: 2 })
        .to(
          card,
          { scale: 0.94, borderRadius: 48, ease: "power2.in", duration: 2 },
          "<",
        );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="why-softwind-title"
      className="relative h-[100dvh] w-full overflow-hidden text-white"
    >
      <div
        data-card
        className="absolute inset-0 flex items-center overflow-hidden bg-[#081212]/40 ring-1 ring-white/10 will-change-transform"
      >
        <div
          aria-hidden
          className="absolute -right-[20%] -top-[30%] h-[50vmax] w-[50vmax] rounded-full bg-[var(--primary)] opacity-[0.06] blur-[120px]"
        />

        <div data-content className="relative w-full will-change-transform">
          <ContentContainer className="relative h-auto w-full">
            <span className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-white/60 md:mb-8 md:text-sm">
              <span className="h-px w-8 bg-[var(--primary)]" />
              Why Softwind Tech
            </span>

            <h2
              id="why-softwind-title"
              aria-label={TITLE.map((s) => s.text).join(" ")}
              className="font-heading text-[clamp(1.75rem,4.2vw,4.25rem)] leading-[1.15] font-semibold tracking-tight"
            >
              {WORDS.map(({ word, highlight }, i) => (
                <Fragment key={i}>
                  <span
                    data-word
                    aria-hidden
                    className={cn(
                      "inline-block opacity-[0.12] will-change-[opacity,transform]",
                      highlight && "text-primary",
                    )}
                  >
                    {word}
                  </span>{" "}
                </Fragment>
              ))}
            </h2>
          </ContentContainer>
        </div>
      </div>
    </section>
  );
};

export default WhySoftwindTech;
