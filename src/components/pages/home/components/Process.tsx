"use client";

import { Fragment, useRef, type MouseEvent, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";
import ContentContainer from "@/components/layout/container/contentContainer";
import { cn } from "@/utils/helpers/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TITLE: { text: string; highlight?: boolean }[] = [
  { text: "From Brief to" },
  { text: "Launch,", highlight: true },
  { text: "Here Is How We Work" },
];

const TITLE_WORDS = TITLE.flatMap((segment) =>
  segment.text
    .split(" ")
    .map((word) => ({ word, highlight: segment.highlight })),
);

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5",
};

const STEPS: {
  title: string;
  duration: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    title: "Discovery & Strategy",
    duration: "Week 1",
    description:
      "We dig into your goals, users and market to define scope, priorities and a clear roadmap.",
    icon: (
      <svg {...iconProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
  },
  {
    title: "Design & Prototype",
    duration: "Week 2–3",
    description:
      "Wireframes, UI design and clickable prototypes so you can see and test the product early.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
      </svg>
    ),
  },
  {
    title: "Development & QA",
    duration: "Week 4–10",
    description:
      "Agile sprints with weekly demos, clean code and thorough testing at every step.",
    icon: (
      <svg {...iconProps}>
        <path d="m8 9-4 3 4 3M16 9l4 3-4 3M13.5 6l-3 12" />
      </svg>
    ),
  },
  {
    title: "Launch & Support",
    duration: "Ongoing",
    description:
      "Smooth deployment, monitoring and continuous improvements as your product grows.",
    icon: (
      <svg {...iconProps}>
        <path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2" />
        <path d="M14.5 4.5C17 2 21 3 21 3s1 4-1.5 6.5L13 16l-5-5z" />
        <path d="M9 10H5l-2 2 4 1M14 15v4l-2 2-1-4" />
      </svg>
    ),
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

type StepState = "idle" | "active" | "done";

// Cursor-following spotlight on hover
const onCardMove = (e: MouseEvent<HTMLElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
};

const scrollToY = (y: number) => {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) lenis.scrollTo(y, { duration: 1.6 });
  else window.scrollTo({ top: y, behavior: "smooth" });
};

const Process = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const goToRef = useRef<((index: number) => void) | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(sectionRef);
      const section = sectionRef.current!;
      const steps = q("[data-step]") as HTMLElement[];
      const fill = q("[data-fill]");
      const content = q("[data-content]");
      const label = q("[data-current]")[0] as HTMLElement;

      let current = -2;
      const setActive = (index: number) => {
        if (index === current) return;
        current = index;
        steps.forEach((step, i) => {
          const state: StepState =
            i < index ? "done" : i === index ? "active" : "idle";
          step.dataset.state = state;
        });
        label.textContent =
          index < 0
            ? "Scroll to begin"
            : `${pad(index + 1)} — ${STEPS[index].title}`;
      };
      setActive(-1);

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const vh = () => window.innerHeight;
      const mm = gsap.matchMedia();

      /* ================= Desktop: pinned horizontal timeline ================= */
      mm.add("(min-width: 768px)", () => {
        if (reduceMotion) {
          gsap.set(fill, { scaleX: 1, scaleY: 1 });
          setActive(STEPS.length - 1);
          return;
        }

        // Approach: title rises, content lands softly
        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top top",
              scrub: 1.5,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            content,
            { y: () => -vh() * 0.2 },
            { y: 0, ease: "power3.in", duration: 1 },
            0,
          )
          .from(
            q("[data-eyebrow]"),
            { y: 20, autoAlpha: 0, duration: 0.3 },
            0.3,
          )
          .from(
            q("[data-title-word]"),
            { yPercent: 110, duration: 0.4, stagger: 0.05, ease: "power3.out" },
            0.35,
          )
          .from(
            q("[data-track]"),
            {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.5,
              ease: "power2.out",
            },
            0.5,
          );

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${vh() * 4}`,
            scrub: 1.5,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Read from self.animation: onUpdate can fire before `tl` is assigned
              const anim = self.animation as gsap.core.Timeline;
              const t = self.progress * anim.duration();
              let index = -1;
              STEPS.forEach((_, i) => {
                if (t >= anim.labels[`step${i}`] - 0.01) index = i;
              });
              setActive(index);
            },
          },
        });

        gsap.set(fill, {
          scaleX: 0,
          scaleY: 1,
          transformOrigin: "left center",
        });

        steps.forEach((step, i) => {
          const isTop = i % 2 === 0;
          const card = step.querySelector("[data-card]");
          const connector = step.querySelector("[data-connector]");

          // Line travels to this step's node (column centers)
          tl.to(fill, {
            scaleX: (i + 0.5) / STEPS.length,
            duration: 1,
            ease: "none",
          })
            .addLabel(`step${i}`)
            .fromTo(
              connector,
              { scaleY: 0 },
              { scaleY: 1, duration: 0.35 },
              `step${i}`,
            )
            .fromTo(
              card,
              { y: isTop ? 50 : -50, autoAlpha: 0, scale: 0.92 },
              { y: 0, autoAlpha: 1, scale: 1, duration: 0.6 },
              `step${i}+=0.15`,
            )
            // Let each step breathe before the line moves on
            .to({}, { duration: 0.5 });
        });

        tl.to(fill, { scaleX: 1, duration: 0.6, ease: "none" })
          .to({}, { duration: 0.3 })
          // Release: content drifts up before the pin lets go
          .fromTo(
            content,
            { y: 0 },
            {
              y: () => -vh() * 0.2,
              ease: "power3.in",
              duration: 0.8,
              immediateRender: false,
            },
          );

        goToRef.current = (index) => {
          const st = tl.scrollTrigger!;
          const ratio = (tl.labels[`step${index}`] + 0.75) / tl.duration();
          scrollToY(st.start + (st.end - st.start) * ratio);
        };
      });

      /* ================= Mobile: vertical timeline, no pin ================= */
      mm.add("(max-width: 767px)", () => {
        gsap.set(fill, { scaleX: 1, scaleY: 0, transformOrigin: "center top" });

        if (reduceMotion) {
          gsap.set(fill, { scaleY: 1 });
          setActive(STEPS.length - 1);
          return;
        }

        gsap.to(fill, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: q("[data-list]")[0],
            start: "top 65%",
            end: "bottom 65%",
            scrub: 1,
          },
        });

        steps.forEach((step, i) => {
          gsap.from(step.querySelector("[data-card]"), {
            x: 40,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
          ScrollTrigger.create({
            trigger: step,
            start: "top 65%",
            end: "bottom 65%",
            onToggle: (self) => self.isActive && setActive(i),
            onLeaveBack: () => i === 0 && setActive(-1),
          });
        });

        goToRef.current = (index) => {
          const top = steps[index].getBoundingClientRect().top + window.scrollY;
          scrollToY(top - vh() * 0.35);
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-labelledby="process-title"
      className="relative w-full overflow-hidden py-24 text-white md:h-[100dvh] md:py-0"
    >
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 h-[45vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--primary)] opacity-[0.07] blur-[140px]"
      />

      <div
        data-content
        className="relative flex h-full flex-col gap-[clamp(24px,4vh,48px)] will-change-transform md:pt-[clamp(90px,12vh,140px)] md:pb-[4vh]"
      >
        <ContentContainer className="h-auto">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span
                data-eyebrow
                className="mb-4 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-white/60 md:text-sm"
              >
                <span className="h-px w-8 bg-[var(--primary)]" />
                Our Process
              </span>
              <h2
                id="process-title"
                aria-label={TITLE.map((s) => s.text).join(" ")}
                className="max-w-3xl font-heading text-[clamp(2rem,3.6vw,3.75rem)] leading-[1.08] font-semibold tracking-tight"
              >
                {TITLE_WORDS.map(({ word, highlight }, i) => (
                  <Fragment key={i}>
                    <span
                      aria-hidden
                      className="inline-block overflow-hidden pb-[0.08em] align-bottom"
                    >
                      <span
                        data-title-word
                        className={cn(
                          "inline-block",
                          highlight && "text-primary",
                        )}
                      >
                        {word}
                      </span>
                    </span>{" "}
                  </Fragment>
                ))}
              </h2>
            </div>

            <p
              aria-live="polite"
              className="hidden items-center gap-3 font-heading text-sm text-white/60 md:flex"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]" />
              <span data-current>Scroll to begin</span>
            </p>
          </div>
        </ContentContainer>

        <ContentContainer className="relative h-auto min-h-0 md:flex-1">
          <ol
            data-list
            className="relative space-y-6 pl-12 md:grid md:h-full md:max-h-[680px] md:grid-cols-4 md:space-y-0 md:pl-0"
          >
            {/* Track + fill */}
            <span
              data-track
              aria-hidden
              className="absolute top-0 bottom-0 left-[15px] w-px bg-white/15 md:top-1/2 md:right-0 md:bottom-auto md:left-0 md:h-px md:w-full"
            >
              <span
                data-fill
                className="absolute inset-0 bg-gradient-to-b from-[var(--primary)] to-[#ff6b6f] shadow-[0_0_16px_var(--primary)] md:bg-gradient-to-r"
              />
            </span>

            {STEPS.map((step, i) => {
              const isTop = i % 2 === 0;
              return (
                <li
                  key={step.title}
                  data-step
                  data-state="idle"
                  className="group/step relative md:h-full"
                >
                  {/* Node */}
                  <button
                    type="button"
                    onClick={() => goToRef.current?.(i)}
                    aria-label={`Go to step ${i + 1}: ${step.title}`}
                    className="absolute top-6 -left-12 z-10 flex h-[31px] w-[31px] cursor-pointer items-center justify-center rounded-full border border-white/20 bg-[#081212] font-heading text-[11px] text-white/50 transition-all duration-500 hover:border-[var(--primary)] hover:text-white group-data-[state=active]/step:scale-125 group-data-[state=active]/step:border-[var(--primary)] group-data-[state=active]/step:bg-[var(--primary)] group-data-[state=active]/step:text-white group-data-[state=active]/step:shadow-[0_0_0_8px_rgba(230,31,37,0.18)] group-data-[state=done]/step:border-[var(--primary)] group-data-[state=done]/step:text-[var(--primary)] md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
                  >
                    <span className="group-data-[state=done]/step:hidden">
                      {pad(i + 1)}
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      className="hidden h-3.5 w-3.5 group-data-[state=done]/step:block"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  </button>

                  {/* Connector from node to card */}
                  <span
                    data-connector
                    aria-hidden
                    className={cn(
                      "absolute left-1/2 hidden h-6 w-px bg-gradient-to-b md:block",
                      isTop
                        ? "bottom-[calc(50%+16px)] origin-bottom from-transparent to-[var(--primary)]"
                        : "top-[calc(50%+16px)] origin-top from-[var(--primary)] to-transparent",
                    )}
                  />

                  {/* Card */}
                  <div
                    data-card
                    className={cn(
                      "md:absolute md:inset-x-2 lg:inset-x-3",
                      isTop
                        ? "md:bottom-[calc(50%+40px)]"
                        : "md:top-[calc(50%+40px)]",
                    )}
                  >
                    <article
                      onMouseMove={onCardMove}
                      onClick={() => goToRef.current?.(i)}
                      className="relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-500 [background-image:radial-gradient(220px_circle_at_var(--mx,-200px)_var(--my,-200px),rgba(230,31,37,0.16),transparent_70%)] hover:-translate-y-1 hover:border-white/25 group-data-[state=active]/step:border-[var(--primary)]/60 group-data-[state=active]/step:bg-white/[0.06] group-data-[state=active]/step:shadow-[0_20px_60px_-20px_rgba(230,31,37,0.45)] group-data-[state=idle]/step:md:opacity-60 lg:p-6"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10 transition-colors duration-500 group-data-[state=active]/step:bg-[var(--primary)] group-data-[state=active]/step:text-white group-data-[state=active]/step:ring-[var(--primary)]">
                          {step.icon}
                        </span>
                        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] whitespace-nowrap text-white/60">
                          {step.duration}
                        </span>
                      </div>
                      <h3 className="mt-4 font-heading text-lg leading-snug font-semibold lg:text-xl">
                        <span className="mr-1.5 text-primary">
                          {pad(i + 1)}.
                        </span>
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed md:text-[13px] lg:text-sm text-white/60">
                        {step.description}
                      </p>
                    </article>
                  </div>
                </li>
              );
            })}
          </ol>
        </ContentContainer>
      </div>
    </section>
  );
};

export default Process;
