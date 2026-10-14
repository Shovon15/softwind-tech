"use client";

import { Fragment, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContentContainer from "@/components/layout/container/contentContainer";
import NavLink from "@/components/common/link/NavLink";
import routes from "@/config/routes";
import { cn } from "@/utils/helpers/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TITLE: { text: string; highlight?: boolean }[] = [
  { text: "Projects We're" },
  { text: "Proud", highlight: true },
  { text: "Of" },
];

const TITLE_WORDS = TITLE.flatMap((segment) =>
  segment.text
    .split(" ")
    .map((word) => ({ word, highlight: segment.highlight })),
);

type Project = {
  title: string;
  category: string;
  year: string;
  description: string;
  points: string[];
  tags: string[];
  // Placeholder visual colors. Add `image` + render <Image> in ProjectVisual for real shots.
  gradient: string;
};

const PROJECTS: Project[] = [
  {
    title: "Finlytics",
    category: "Fintech Dashboard",
    year: "2025",
    description:
      "A real-time analytics platform that helps finance teams track cash flow, forecast revenue and spot risks before they happen.",
    points: [
      "Live data from 12+ banking APIs",
      "40% faster monthly reporting",
      "Role-based access for 2,000+ users",
    ],
    tags: ["Next.js", "Node.js", "PostgreSQL"],
    gradient: "from-[#1d4ed8] via-[#2563eb] to-[#0ea5e9]",
  },
  {
    title: "MediCare+",
    category: "Telehealth App",
    year: "2025",
    description:
      "A mobile app connecting patients with doctors through video consultations, digital prescriptions and appointment booking.",
    points: [
      "HIPAA-ready video consultations",
      "50k+ downloads in the first quarter",
      "4.8 average app store rating",
    ],
    tags: ["React Native", "WebRTC", "Firebase"],
    gradient: "from-[#047857] via-[#10b981] to-[#6ee7b7]",
  },
  {
    title: "ShopNest",
    category: "E-commerce Platform",
    year: "2024",
    description:
      "A headless storefront with lightning-fast pages, smart search and a checkout flow built to reduce cart abandonment.",
    points: [
      "Sub-second page loads worldwide",
      "32% lift in conversion rate",
      "Multi-currency & multi-language",
    ],
    tags: ["Next.js", "Shopify", "Algolia"],
    gradient: "from-[#be123c] via-[#e61f25] to-[#fb923c]",
  },
  {
    title: "RouteIQ",
    category: "Logistics & Fleet Tracking",
    year: "2024",
    description:
      "A fleet management system with live GPS tracking, route optimisation and driver apps for a regional delivery company.",
    points: [
      "Tracks 800+ vehicles in real time",
      "18% reduction in fuel costs",
      "Offline-first driver mobile app",
    ],
    tags: ["React", "Go", "Mapbox"],
    gradient: "from-[#6d28d9] via-[#8b5cf6] to-[#c4b5fd]",
  },
  {
    title: "Learnly",
    category: "E-learning LMS",
    year: "2023",
    description:
      "A learning management system with interactive courses, progress tracking and certificates for an online academy.",
    points: [
      "120k+ active learners",
      "Built-in quizzes & certificates",
      "Instructor revenue dashboard",
    ],
    tags: ["Laravel", "Vue", "AWS"],
    gradient: "from-[#b45309] via-[#f59e0b] to-[#fde68a]",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

const ProjectVisual = ({ project }: { project: Project }) => (
  <div
    className={cn(
      "relative h-full w-full overflow-hidden bg-gradient-to-br",
      project.gradient,
    )}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.35),transparent_45%)]" />
    {/* Mock app window */}
    <div className="absolute top-[14%] left-[10%] right-[-6%] bottom-[-8%] rounded-tl-2xl border border-white/30 bg-white/15 shadow-2xl backdrop-blur-md">
      <div className="flex gap-1.5 border-b border-white/20 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
      </div>
      <div className="grid grid-cols-3 gap-3 p-4">
        <div className="col-span-2 space-y-2">
          <div className="h-3 w-1/2 rounded-full bg-white/70" />
          <div className="h-2 w-3/4 rounded-full bg-white/40" />
          <div className="mt-4 flex h-24 items-end gap-1.5 md:h-32">
            {[40, 65, 50, 80, 60, 95, 75].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-t-md bg-white/60"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-14 rounded-xl bg-white/40" />
          <div className="h-14 rounded-xl bg-white/25" />
          <div className="h-14 rounded-xl bg-white/25" />
        </div>
      </div>
    </div>
    <span className="absolute top-5 left-6 font-heading text-sm font-semibold text-white/90">
      {project.title}
    </span>
  </div>
);

const SelectedWork = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(sectionRef);
      const section = sectionRef.current!;
      const content = q("[data-content]");
      const cards = q("[data-project]") as HTMLElement[];
      const counter = q("[data-counter]")[0] as HTMLElement;
      const dots = q("[data-dot]") as HTMLElement[];

      const setActive = (index: number) => {
        counter.textContent = pad(index + 1);
        dots.forEach((dot, i) =>
          dot.classList.toggle("is-active", i === index),
        );
      };
      setActive(0);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Stack the cards normally instead of layering them
        section.classList.add("is-static");
        return;
      }

      const vh = () => window.innerHeight;
      const STEP = 1; // timeline units per card change
      const stepLength = () => vh() * 1.8; // scroll px per card change
      const releaseUnits = 0.6;
      const totalUnits = (cards.length - 1) * STEP + 0.5 + releaseUnits;

      /* ---------- Approach: title + first card land softly ---------- */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top top",
            scrub: 1.8,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          content,
          { y: () => -vh() * 0.2 },
          { y: 0, ease: "power3.in", duration: 1 },
          0,
        )
        .from(q("[data-eyebrow]"), { y: 20, autoAlpha: 0, duration: 0.3 }, 0.3)
        .from(
          q("[data-title-word]"),
          { yPercent: 110, duration: 0.4, stagger: 0.06, ease: "power3.out" },
          0.35,
        )
        // Animate the stage, not cards[0]: the pinned timeline below also drives cards[0]
        // (fading it out), and two lagging scrubs on one element made it reappear behind
        // the other cards after a fast scroll
        .from(
          q("[data-stage]"),
          {
            y: () => vh() * 0.25,
            scale: 0.92,
            autoAlpha: 0,
            duration: 0.55,
            ease: "power2.out",
          },
          0.45,
        );

      /* ---------- Pinned: cards rise in one by one, previous slides off to the side ---------- */
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${(stepLength() * totalUnits) / STEP}`,
          scrub: 1.8,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const t = self.progress * totalUnits;
            // Switch the counter at the midpoint of each transition (hold 0.25 + half of 0.8)
            const index = Math.floor((t - 0.65) / STEP) + 1;
            setActive(gsap.utils.clamp(0, cards.length - 1, index));
          },
        },
      });

      cards.forEach((card, i) => {
        if (i === 0) return;
        const prev = cards[i - 1];
        const at = (i - 1) * STEP + 0.25; // small hold before the first switch

        tl.fromTo(
          card,
          { yPercent: 115, rotate: 3, scale: 0.94 },
          { yPercent: 0, rotate: 0, scale: 1, duration: STEP * 0.8 },
          at,
        )
          .fromTo(
            card.querySelector("[data-visual]"),
            { scale: 1.25 },
            { scale: 1, duration: STEP * 0.9, ease: "power2.out" },
            at,
          )
          .fromTo(
            card.querySelectorAll("[data-reveal]"),
            { y: 40, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: STEP * 0.45,
              stagger: 0.05,
              ease: "power2.out",
            },
            at + STEP * 0.35,
          )
          // Previous card drifts off to the left, shrinking and fading
          .fromTo(
            prev,
            {
              xPercent: 0,
              rotate: 0,
              scale: 1,
              autoAlpha: 1,
              filter: "blur(0px)",
            },
            {
              xPercent: -35,
              rotate: -6,
              scale: 0.82,
              autoAlpha: 0,
              filter: "blur(4px)",
              duration: STEP * 0.8,
              immediateRender: false,
            },
            at,
          );
      });

      // Release: content starts drifting up before the pin lets go
      tl.to({}, { duration: 0.25 }).fromTo(
        content,
        { y: 0 },
        {
          y: () => -vh() * 0.2,
          ease: "power3.in",
          duration: releaseUnits,
          immediateRender: false,
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="selected-work"
      aria-labelledby="selected-work-title"
      className="group/work relative h-[100dvh] w-full overflow-hidden text-white [&.is-static]:h-auto"
    >
      <div
        data-content
        className="relative flex h-full flex-col gap-[clamp(20px,4vh,44px)] pt-[clamp(90px,12vh,140px)] pb-[5vh] will-change-transform"
      >
        <ContentContainer className="h-auto">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span
                data-eyebrow
                className="mb-4 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-white/60 md:text-sm"
              >
                <span className="h-px w-8 bg-[var(--primary)]" />
                Selected Work
              </span>
              <h2
                id="selected-work-title"
                aria-label={TITLE.map((s) => s.text).join(" ")}
                className="font-heading text-[clamp(2rem,4.5vw,4.5rem)] leading-[1.08] font-semibold tracking-tight"
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

            <div className="flex items-center gap-5">
              <span className="font-heading text-sm text-white/50">
                <span data-counter className="text-white">
                  01
                </span>{" "}
                / {pad(PROJECTS.length)}
              </span>
              <span className="flex items-center gap-1.5">
                {PROJECTS.map((p) => (
                  <span
                    key={p.title}
                    data-dot
                    className="h-1.5 w-1.5 rounded-full bg-white/20 transition-all duration-500 [&.is-active]:w-6 [&.is-active]:bg-[var(--primary)]"
                  />
                ))}
              </span>
            </div>
          </div>
        </ContentContainer>

        <ContentContainer className="relative h-auto min-h-0 flex-1">
          <div
            data-stage
            className="relative h-full group-[.is-static]/work:space-y-6"
          >
            {PROJECTS.map((project, i) => (
              <article
                key={project.title}
                data-project
                style={{ zIndex: i + 1 }}
                className="absolute inset-0 grid origin-bottom grid-rows-[38%_1fr] overflow-hidden rounded-3xl bg-gradient-to-br from-[#122626] via-[#0d1c1c] to-[#091414] text-white shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10 will-change-transform md:grid-cols-2 md:grid-rows-1 group-[.is-static]/work:relative group-[.is-static]/work:min-h-[560px]"
              >
                <div className="relative overflow-hidden md:order-2">
                  <div
                    data-visual
                    className="h-full w-full will-change-transform"
                  >
                    <ProjectVisual project={project} />
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-4 overflow-hidden p-6 md:gap-5 md:p-10 xl:p-14">
                  <div
                    data-reveal
                    className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-white/50"
                  >
                    <span className="text-primary">{pad(i + 1)}</span>
                    <span className="h-px w-6 bg-white/20" />
                    {project.category} · {project.year}
                  </div>

                  <h3
                    data-reveal
                    className="font-heading text-[clamp(1.6rem,3vw,3rem)] leading-tight font-semibold tracking-tight"
                  >
                    {project.title}
                  </h3>

                  <p
                    data-reveal
                    className="max-w-lg text-sm leading-relaxed text-white/60 md:text-base"
                  >
                    {project.description}
                  </p>

                  <ul className="hidden space-y-2.5 sm:block">
                    {project.points.map((point) => (
                      <li
                        key={point}
                        data-reveal
                        className="flex items-start gap-3 text-sm text-white/80 md:text-[15px]"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m5 12 5 5L20 7" />
                          </svg>
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div
                    data-reveal
                    className="flex flex-wrap items-center gap-2"
                  >
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div data-reveal>
                    <NavLink
                      href={routes.contact}
                      hover={false}
                      className="group/link inline-flex items-center gap-2 text-sm font-medium"
                    >
                      View case study
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover/link:translate-x-1 group-hover/link:border-[var(--primary)] group-hover/link:bg-[var(--primary)] group-hover/link:text-white">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </NavLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </ContentContainer>
      </div>
    </section>
  );
};

export default SelectedWork;
