"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SHOW_AFTER = 500; // px scrolled before the button appears

const Arrow = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);

/**
 * Floating "back to top" button.
 * - Ring fills with page scroll progress
 * - Pops in with a spin once you scroll down
 * - On click it "launches": squash, arrow blasts off with a trail, shockwave, then smooth-scrolls up
 */
const BackToTop = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef);
      const btn = q("[data-btn]")[0];
      const ring = q("[data-ring]")[0];
      let visible = false;
      let launching = false;

      gsap.set(btn, { scale: 0, rotate: -180, autoAlpha: 0 });

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          gsap.set(ring, {
            strokeDashoffset: CIRCUMFERENCE * (1 - self.progress),
          });

          const shouldShow = self.scroll() > SHOW_AFTER;
          if (shouldShow === visible || launching) return;
          visible = shouldShow;

          gsap.to(
            btn,
            shouldShow
              ? {
                  scale: 1,
                  rotate: 0,
                  autoAlpha: 1,
                  duration: 0.9,
                  ease: "elastic.out(1, 0.55)",
                  overwrite: true,
                }
              : {
                  scale: 0,
                  rotate: 180,
                  autoAlpha: 0,
                  duration: 0.45,
                  ease: "back.in(1.6)",
                  overwrite: true,
                },
          );
        },
      });

      /* ---------- Launch on click ---------- */
      const launch = () => {
        if (launching) return;
        launching = true;

        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;

        const scrollUp = () => {
          if (lenis) lenis.scrollTo(0, { duration: reduceMotion ? 0 : 2 });
          else
            window.scrollTo({
              top: 0,
              behavior: reduceMotion ? "auto" : "smooth",
            });
        };

        if (reduceMotion) {
          scrollUp();
          launching = false;
          return;
        }

        gsap
          .timeline({
            onComplete: () => {
              launching = false;
            },
          })
          // Charge up: squash down
          .to(q("[data-btn]"), {
            scaleY: 0.82,
            scaleX: 1.1,
            duration: 0.18,
            ease: "power2.in",
          })
          // Release: stretch + arrow blasts off with a trail
          .to(q("[data-btn]"), {
            scaleY: 1,
            scaleX: 1,
            duration: 0.6,
            ease: "elastic.out(1.2, 0.4)",
          })
          .to(
            q("[data-arrow]"),
            { yPercent: -260, duration: 0.45, ease: "power3.in" },
            "<",
          )
          .fromTo(
            q("[data-trail]"),
            { scaleY: 0, autoAlpha: 1 },
            { scaleY: 1, autoAlpha: 0, duration: 0.5, ease: "power2.out" },
            "<0.1",
          )
          .fromTo(
            q("[data-shock]"),
            { scale: 0.8, autoAlpha: 0.7 },
            { scale: 2.4, autoAlpha: 0, duration: 0.7, ease: "power2.out" },
            "<",
          )
          .add(scrollUp, "<")
          // New arrow drops back in from below
          .fromTo(
            q("[data-arrow]"),
            { yPercent: 200 },
            { yPercent: 0, duration: 0.5, ease: "back.out(2)" },
            "+=0.25",
          );
      };

      btn.addEventListener("click", launch);
      return () => btn.removeEventListener("click", launch);
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="fixed right-4 bottom-4 z-40 md:right-6 md:bottom-6"
    >
      <button
        data-btn
        type="button"
        aria-label="Back to top"
        className="group invisible relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#081212]/85 text-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)] ring-1 ring-white/10 backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_0_0_6px_rgba(230,31,37,0.15),0_15px_40px_-10px_rgba(230,31,37,0.6)] md:h-16 md:w-16"
      >
        {/* Shockwave on launch */}
        <span
          data-shock
          aria-hidden
          className="pointer-events-none invisible absolute inset-0 rounded-full border-2 border-[var(--primary)] opacity-0"
        />

        {/* Scroll progress ring */}
        <svg
          viewBox="0 0 60 60"
          className="absolute inset-0 h-full w-full -rotate-90"
          aria-hidden
        >
          <circle
            cx="30"
            cy="30"
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2"
          />
          <circle
            data-ring
            cx="30"
            cy="30"
            r={RADIUS}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
          />
        </svg>

        {/* Inner red core grows on hover */}
        <span
          aria-hidden
          className="absolute inset-[7px] scale-0 rounded-full bg-[var(--primary)] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-100"
        />

        {/* Arrow (rolls on hover) + launch trail */}
        <span className="relative h-5 w-5 overflow-hidden">
          <span data-arrow className="absolute inset-0 block">
            <span className="block transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:-translate-y-[140%]">
              <Arrow className="h-5 w-5" />
            </span>
            <span className="absolute inset-0 block translate-y-[140%] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-y-0">
              <Arrow className="h-5 w-5" />
            </span>
          </span>
        </span>
        <span
          data-trail
          aria-hidden
          className="pointer-events-none invisible absolute top-1/2 left-1/2 h-8 w-[3px] -translate-x-1/2 origin-top rounded-full bg-gradient-to-b from-white to-transparent opacity-0"
        />
      </button>
    </div>
  );
};

export default BackToTop;
