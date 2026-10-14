"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import ContentContainer from "@/components/layout/container/contentContainer";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import NavLink from "@/components/common/link/NavLink";
import routes from "@/config/routes";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const STATS = [
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 6, suffix: "+", label: "Years of Experience" },
  { value: 12, suffix: "", label: "Countries Served" },
];

const Banner = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(sectionRef);
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.set(q("[data-intro-root]"), { autoAlpha: 1 });

      if (reduceMotion) return;

      /* ---------- Intro (on load) ---------- */
      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });

      intro
        .from(q("[data-bg]"), { scale: 1.2, autoAlpha: 0, duration: 1.6 }, 0)
        .from(q("[data-eyebrow]"), { y: 24, autoAlpha: 0, duration: 0.9 }, 0.2);

      SplitText.create(q("[data-title]"), {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        // Returned tween is re-synced by SplitText when lines re-split on resize
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            stagger: 0.12,
            delay: 0.35,
            ease: "power4.out",
          }),
      });

      intro
        .from(q("[data-desc]"), { y: 30, autoAlpha: 0, duration: 1 }, 0.75)
        .from(
          q("[data-cta]"),
          { y: 30, scale: 0.9, autoAlpha: 0, duration: 1 },
          0.9,
        )
        .from(
          q("[data-stat]"),
          { y: 40, autoAlpha: 0, duration: 1, stagger: 0.12 },
          1,
        );

      // Count the stat numbers up from 0
      q("[data-count]").forEach((el: HTMLElement, i: number) => {
        const target = Number(el.dataset.count);
        const counter = { val: 0 };
        intro.to(
          counter,
          {
            val: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = String(Math.round(counter.val));
            },
          },
          1.05 + i * 0.12,
        );
      });

      /* ---------- Scroll: zoom in + fade out, then release ---------- */
      const outro = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=100%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      outro
        .to(
          q("[data-left]"),
          { scale: 1.35, autoAlpha: 0, filter: "blur(1px)", duration: 1 },
          0,
        )
        .to(
          q("[data-stats]"),
          { scale: 1.5, autoAlpha: 0, filter: "blur(1px)", duration: 0.85 },
          0.1,
        );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[100dvh] w-full overflow-hidden text-white"
    >
      {/* Background */}
      <div
        data-bg
        aria-hidden
        className="absolute inset-0 will-change-transform"
      >
        <div className="absolute -left-[10%] top-[10%] h-[60vmax] w-[60vmax] rounded-full bg-[var(--primary)] opacity-25 blur-[140px]" />
        <div className="absolute -right-[15%] -bottom-[20%] h-[55vmax] w-[55vmax] rounded-full bg-[#1d6b6b] opacity-30 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <ContentContainer className="relative z-10">
        <div
          data-intro-root
          className="invisible grid h-full grid-cols-1 gap-10 pt-[clamp(110px,14vh,160px)] pb-10 lg:grid-cols-12 lg:gap-6 lg:pb-[8vh]"
        >
          {/* Left: copy */}
          <div
            data-left
            className="flex origin-[30%_50%] flex-col justify-center will-change-transform lg:col-span-7"
          >
            <span
              data-eyebrow
              className="mb-5 inline-flex w-fit items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/80 backdrop-blur md:text-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
              Software Development Company
            </span>

            <h1
              data-title
              className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] font-semibold tracking-tight"
            >
              We build digital products that{" "}
              <span className="text-primary">scale</span> your business.
            </h1>

            <p
              data-desc
              className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg"
            >
              From idea to launch, our team designs and engineers fast, reliable
              web and mobile software for startups and growing companies
              worldwide.
            </p>

            <div data-cta className="mt-9 w-fit">
              <NavLink href={routes.contact} hover={false}>
                <PrimaryButton as="span" innerClassName="px-8 py-4 text-base">
                  Start a Project
                </PrimaryButton>
              </NavLink>
            </div>
          </div>

          {/* Right: stats pinned to the bottom */}
          <div className="flex items-end lg:col-span-5 lg:justify-end">
            <ul
              data-stats
              className="grid w-full origin-bottom-right grid-cols-3 gap-4 will-change-transform md:gap-8 lg:w-auto"
            >
              {STATS.map((stat) => (
                <li
                  key={stat.label}
                  data-stat
                  className="border-l border-white/15 pl-4 md:pl-6"
                >
                  <p className="font-heading text-[clamp(2rem,4vw,3.75rem)] leading-none font-semibold">
                    <span data-count={stat.value}>{stat.value}</span>
                    <span className="text-primary">{stat.suffix}</span>
                  </p>
                  <p className="mt-2 text-xs text-white/55 md:text-sm">
                    {stat.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ContentContainer>
    </section>
  );
};

export default Banner;
