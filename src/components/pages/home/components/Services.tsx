"use client";

import { Fragment, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContentContainer from "@/components/layout/container/contentContainer";
import NavLink from "@/components/common/link/NavLink";
import routes from "@/config/routes";
import { cn } from "@/utils/helpers/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TITLE: { text: string; highlight?: boolean }[] = [
  { text: "Our Services That" },
  { text: "Grow", highlight: true },
  { text: "Your Business" },
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
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-7 w-7",
};

const SERVICES: {
  title: string;
  description: string;
  tags: string[];
  icon: ReactNode;
}[] = [
  {
    title: "Web Development",
    description:
      "Fast, secure and SEO-ready websites and web apps built with modern frameworks that convert visitors into customers.",
    tags: ["Next.js", "React", "Node.js"],
    icon: (
      <svg {...iconProps}>
        <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
        <path d="M2.5 8.5h19M9 13l-2 2 2 2M15 13l2 2-2 2" />
      </svg>
    ),
  },
  {
    title: "Mobile App Development",
    description:
      "Native-feeling iOS and Android apps from a single codebase, designed for performance and smooth everyday use.",
    tags: ["React Native", "Flutter", "iOS / Android"],
    icon: (
      <svg {...iconProps}>
        <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
        <path d="M10.5 18.5h3" />
      </svg>
    ),
  },
  {
    title: "UI/UX Design",
    description:
      "Research-driven interfaces and design systems that make complex products feel simple, clear and delightful.",
    tags: ["Figma", "Prototyping", "Design Systems"],
    icon: (
      <svg {...iconProps}>
        <path d="M12 21a9 9 0 1 1 9-9c0 2.5-2 3.5-4 3.5h-1.5a1.5 1.5 0 0 0-1 2.6c.6.6.3 2.9-2.5 2.9z" />
        <circle cx="7.5" cy="11" r="1" fill="currentColor" />
        <circle cx="11" cy="7" r="1" fill="currentColor" />
        <circle cx="16" cy="8.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Custom Software & SaaS",
    description:
      "Scalable platforms, dashboards and internal tools tailored to your workflow, from MVP to enterprise scale.",
    tags: ["SaaS", "APIs", "Automation"],
    icon: (
      <svg {...iconProps}>
        <path d="M12 2.5 21 7v10l-9 4.5L3 17V7z" />
        <path d="M3 7l9 4.5L21 7M12 11.5v10" />
      </svg>
    ),
  },
  {
    title: "Cloud & DevOps",
    description:
      "Reliable infrastructure, CI/CD pipelines and monitoring so your product ships faster and stays online.",
    tags: ["AWS", "Docker", "CI/CD"],
    icon: (
      <svg {...iconProps}>
        <path d="M7 18.5a4.5 4.5 0 0 1-.5-8.97A6 6 0 0 1 18 9a4.25 4.25 0 0 1 0 8.5z" />
        <path d="M12 12v5M9.5 14.5 12 12l2.5 2.5" />
      </svg>
    ),
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(sectionRef);
      const section = sectionRef.current!;
      const track = q("[data-track]")[0] as HTMLElement;
      const content = q("[data-content]");
      const counter = q("[data-counter]")[0] as HTMLElement;
      const cards = q("[data-svc]") as HTMLElement[];

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Fall back to a native horizontal scroller
        track.parentElement!.classList.add("overflow-x-auto");
        return;
      }

      const vh = () => window.innerHeight;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const releaseLength = () => vh() * 0.6;

      /* ---------- Approach: title words rise, cards slide up, content lands softly ---------- */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top top",
            scrub: 1.2,
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
        .from(
          track,
          {
            y: () => vh() * 0.15,
            autoAlpha: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          0.45,
        );

      /* ---------- Pin for the whole horizontal run + soft release ---------- */
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${distance() + releaseLength()}`,
        pin: true,
        invalidateOnRefresh: true,
      });

      /* ---------- Horizontal run (linear, so cards can use it as containerAnimation) ---------- */
      const run = gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1.2,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const index = Math.min(
                cards.length,
                Math.floor(self.progress * cards.length) + 1,
              );
              counter.textContent = pad(index);
            },
          },
        })
        .to(track, { x: () => -distance() }, 0)
        .fromTo(q("[data-progress]"), { scaleX: 0 }, { scaleX: 1 }, 0);

      /* ---------- Per-card: swing in from the right, recede off the left ---------- */
      cards.forEach((card) => {
        const inner = card.querySelector("[data-svc-inner]");
        const icon = card.querySelector("[data-svc-icon]");
        const num = card.querySelector("[data-svc-num]");

        gsap
          .timeline({
            scrollTrigger: {
              trigger: card,
              containerAnimation: run,
              start: "left right",
              // Ends before the 3rd card's resting spot so the first 3 start fully settled
              end: "left 72%",
              scrub: true,
            },
          })
          .fromTo(
            card,
            { rotateY: -28, scale: 0.85, autoAlpha: 0.25, y: 60 },
            { rotateY: 0, scale: 1, autoAlpha: 1, y: 0, ease: "power2.out" },
            0,
          )
          .fromTo(
            icon,
            { scale: 0.4, rotate: -90 },
            { scale: 1, rotate: 0, ease: "back.out(1.6)" },
            0.15,
          )
          .fromTo(
            num,
            { xPercent: 60 },
            { xPercent: 0, ease: "power2.out" },
            0,
          );

        gsap.fromTo(
          inner,
          { scale: 1, autoAlpha: 1 },
          {
            scale: 0.9,
            autoAlpha: 0.35,
            ease: "power1.in",
            scrollTrigger: {
              trigger: card,
              containerAnimation: run,
              start: "right 30%",
              end: "right left",
              scrub: true,
            },
          },
        );
      });

      /* ---------- Release: content starts drifting up before the pin lets go ---------- */
      // fromTo + immediateRender:false so it doesn't capture the approach's offset as its start
      gsap.fromTo(
        content,
        { y: 0 },
        {
          y: () => -vh() * 0.2,
          ease: "power3.in",
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: () => `top top-=${distance()}`,
            end: () => `+=${releaseLength()}`,
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-title"
      className="relative h-[100dvh] w-full overflow-hidden bg-[#081212] text-white"
    >
      <div
        aria-hidden
        className="absolute -left-[15%] bottom-[-30%] h-[55vmax] w-[55vmax] rounded-full bg-[var(--primary)] opacity-[0.12] blur-[150px]"
      />

      <div
        data-content
        className="relative flex h-full flex-col justify-center gap-[clamp(28px,5vh,56px)] pt-[clamp(90px,12vh,140px)] pb-[6vh] will-change-transform"
      >
        <ContentContainer className="h-auto">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span
                data-eyebrow
                className="mb-4 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-white/60 md:text-sm"
              >
                <span className="h-px w-8 bg-[var(--primary)]" />
                Our Services
              </span>
              <h2
                id="services-title"
                aria-label={TITLE.map((s) => s.text).join(" ")}
                className="max-w-3xl font-heading text-[clamp(2rem,4.5vw,4.5rem)] leading-[1.08] font-semibold tracking-tight"
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

            <div className="flex items-center gap-4 font-heading text-sm text-white/60">
              <span>
                <span data-counter className="text-white">
                  01
                </span>{" "}
                / {pad(SERVICES.length)}
              </span>
              <span className="relative h-px w-28 overflow-hidden bg-white/15 md:w-40">
                <span
                  data-progress
                  className="absolute inset-0 origin-left bg-[var(--primary)]"
                />
              </span>
            </div>
          </div>
        </ContentContainer>

        <div className="[perspective:1400px]">
          <ul
            data-track
            className="flex w-max gap-5 px-4 will-change-transform md:gap-7 md:px-[7vw] 2xl:px-[9vw]"
          >
            {SERVICES.map((service, i) => (
              <li
                key={service.title}
                data-svc
                className="w-[calc((100vw-16px-20px)/1.15)] md:w-[calc((93vw-56px)/2.15)] lg:w-[calc((93vw-84px)/3.15)] 2xl:w-[calc((91vw-84px)/3.15)] shrink-0 origin-left [transform-style:preserve-3d]"
              >
                <article
                  data-svc-inner
                  className="group relative flex h-[clamp(360px,52vh,500px)] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition-colors duration-500 hover:border-[var(--primary)]/50 md:p-9"
                >
                  {/* Hover glow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-1/3 -top-1/3 h-2/3 w-2/3 rounded-full bg-[var(--primary)] opacity-0 blur-[90px] transition-opacity duration-500 group-hover:opacity-30"
                  />
                  <span
                    data-svc-num
                    aria-hidden
                    className="pointer-events-none absolute -right-2 -bottom-8 font-heading text-[clamp(7rem,12vw,10rem)] leading-none font-bold text-white/[0.04]"
                  >
                    {pad(i + 1)}
                  </span>

                  <div className="relative flex items-start justify-between">
                    <span
                      data-svc-icon
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/30 transition-colors duration-500 group-hover:bg-[var(--primary)] group-hover:text-white"
                    >
                      {service.icon}
                    </span>
                    <span className="font-heading text-sm text-white/40">
                      {pad(i + 1)}
                    </span>
                  </div>

                  <div className="relative">
                    <h3 className="font-heading text-[clamp(1.4rem,2vw,1.9rem)] leading-tight font-semibold">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
                      {service.description}
                    </p>

                    <ul className="mt-5 flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>

                    <NavLink
                      href={routes.contact}
                      hover={false}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white"
                    >
                      Let&apos;s talk
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)]">
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
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Services;
