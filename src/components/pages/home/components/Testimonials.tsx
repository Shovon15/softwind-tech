"use client";

import { Fragment, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContentContainer from "@/components/layout/container/contentContainer";
import { cn } from "@/utils/helpers/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TITLE: { text: string; highlight?: boolean }[] = [
  { text: "Trusted by people who" },
  { text: "build.", highlight: true },
];

const TITLE_WORDS = TITLE.flatMap((segment) =>
  segment.text
    .split(" ")
    .map((word) => ({ word, highlight: segment.highlight })),
);

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  avatar: string; // gradient for the initials avatar; swap for a photo later
  accent?: boolean;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Softwind Tech felt like an extension of our own team. They shipped our dashboard ahead of schedule and the code quality is outstanding.",
    name: "Sarah Mitchell",
    role: "CTO",
    company: "Finlytics",
    rating: 5,
    avatar: "from-sky-500 to-blue-700",
  },
  {
    quote:
      "From the first workshop to launch day, communication was crystal clear. Our app hit 50k downloads in three months.",
    name: "Daniel Okafor",
    role: "Founder",
    company: "MediCare+",
    rating: 5,
    avatar: "from-emerald-400 to-emerald-700",
    accent: true,
  },
  {
    quote:
      "They challenged our assumptions in the best way. The new checkout flow alone lifted our conversion rate by over 30%.",
    name: "Emma Larsen",
    role: "Head of E-commerce",
    company: "ShopNest",
    rating: 5,
    avatar: "from-rose-500 to-orange-500",
  },
  {
    quote:
      "Reliable, honest timelines and zero surprises. Our drivers love the offline app and our fuel costs dropped noticeably.",
    name: "Marcus Chen",
    role: "Operations Director",
    company: "RouteIQ",
    rating: 5,
    avatar: "from-violet-500 to-purple-700",
  },
  {
    quote:
      "We came with a rough idea and left with a polished product. The design process was collaborative and genuinely fun.",
    name: "Aisha Rahman",
    role: "Product Lead",
    company: "Learnly",
    rating: 5,
    avatar: "from-amber-400 to-orange-600",
  },
  {
    quote:
      "Post-launch support is where they really shine. Issues are fixed fast and they keep suggesting smart improvements.",
    name: "Lucas Moreau",
    role: "CEO",
    company: "Nimbus",
    rating: 4,
    avatar: "from-teal-400 to-cyan-700",
  },
];

// Distribute into 3 columns for the staggered / parallax layout
const COLUMNS = [0, 1, 2].map((c) =>
  TESTIMONIALS.filter((_, i) => i % 3 === c),
);

const STATS = [
  { value: 4.9, decimals: 1, suffix: "/5", label: "Average client rating" },
  { value: 98, decimals: 0, suffix: "%", label: "Client retention" },
  { value: 50, decimals: 0, suffix: "+", label: "Happy clients" },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

const Stars = ({ rating, accent }: { rating: number; accent?: boolean }) => (
  <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        viewBox="0 0 24 24"
        className={cn(
          "h-4 w-4",
          i < rating
            ? accent
              ? "text-white"
              : "text-[var(--primary)]"
            : accent
              ? "text-white/30"
              : "text-black/15",
        )}
        fill="currentColor"
        aria-hidden
      >
        <path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" />
      </svg>
    ))}
  </div>
);

const TestimonialCard = ({ t }: { t: Testimonial }) => (
  <div data-reveal className="[perspective:1000px]">
    <figure
      data-tilt
      className={cn(
        "group relative overflow-hidden rounded-3xl p-7 transition-shadow duration-500 will-change-transform [transform-style:preserve-3d] md:p-8",
        t.accent
          ? "bg-[var(--primary)] text-white shadow-[0_30px_70px_-25px_rgba(230,31,37,0.6)]"
          : "bg-white text-[var(--foreground)] shadow-[0_20px_50px_-30px_rgba(8,18,18,0.35)] ring-1 ring-black/5 hover:shadow-[0_35px_80px_-30px_rgba(8,18,18,0.45)]",
      )}
    >
      {/* Glare that follows the cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(320px_circle_at_var(--gx,50%)_var(--gy,50%),rgba(255,255,255,0.35),transparent_60%)]"
      />
      {/* Big quote mark */}
      <svg
        aria-hidden
        viewBox="0 0 48 48"
        className={cn(
          "absolute -top-2 right-5 h-24 w-24 transition-transform duration-700 group-hover:translate-x-[-6px] group-hover:rotate-[-8deg]",
          t.accent ? "text-white/15" : "text-[var(--primary)]/10",
        )}
        fill="currentColor"
      >
        <path d="M20 12C11 14 6 21 6 30v8h14V24h-7c0-5 3-8 8-9zM42 12c-9 2-14 9-14 18v8h14V24h-7c0-5 3-8 8-9z" />
      </svg>

      <div className="relative [transform:translateZ(30px)]">
        <Stars rating={t.rating} accent={t.accent} />
        <blockquote
          className={cn(
            "mt-5 text-[15px] leading-relaxed md:text-base",
            t.accent ? "text-white/90" : "text-black/70",
          )}
        >
          “{t.quote}”
        </blockquote>

        <figcaption className="mt-7 flex items-center gap-3.5">
          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-heading text-sm font-semibold text-white ring-2 transition-transform duration-500 group-hover:scale-110",
              t.avatar,
              t.accent ? "ring-white/40" : "ring-white",
            )}
          >
            {initials(t.name)}
          </span>
          <span>
            <span className="block font-heading text-[15px] font-semibold">
              {t.name}
            </span>
            <span
              className={cn(
                "block text-xs",
                t.accent ? "text-white/70" : "text-black/50",
              )}
            >
              {t.role}, {t.company}
            </span>
          </span>
        </figcaption>
      </div>
    </figure>
  </div>
);

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(sectionRef);
      const section = sectionRef.current!;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      /* ---------- Heading ---------- */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 35%",
            scrub: 1.2,
          },
        })
        .from(q("[data-eyebrow]"), { y: 20, autoAlpha: 0, duration: 0.3 })
        .from(
          q("[data-title-word]"),
          { yPercent: 110, duration: 0.5, stagger: 0.07, ease: "power3.out" },
          0.1,
        )
        .from(
          q("[data-stat]"),
          { y: 30, autoAlpha: 0, duration: 0.4, stagger: 0.08 },
          0.3,
        );

      /* ---------- Stat counters ---------- */
      q("[data-count]").forEach((el: HTMLElement) => {
        const target = Number(el.dataset.count);
        const decimals = Number(el.dataset.decimals);
        const counter = { val: 0 };
        gsap.to(counter, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          onUpdate: () => {
            el.textContent = counter.val.toFixed(decimals);
          },
        });
      });

      /* ---------- Cards fly in, slightly rotated; reverse on scroll back ---------- */
      q("[data-reveal]").forEach((card: HTMLElement, i: number) => {
        gsap.from(card, {
          y: 100,
          rotate: i % 2 ? 5 : -5,
          scale: 0.9,
          autoAlpha: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        });
      });

      /* ---------- Column parallax (desktop) ---------- */
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const speeds = [120, -60, 160];
        q("[data-column]").forEach((col: HTMLElement, i: number) => {
          gsap.fromTo(
            col,
            { y: speeds[i] },
            {
              y: -speeds[i],
              ease: "none",
              scrollTrigger: {
                trigger: q("[data-grid]")[0],
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
              },
            },
          );
        });
      });

      /* ---------- 3D tilt + glare on hover ---------- */
      const canHover = window.matchMedia("(hover: hover)").matches;
      const cleanups: (() => void)[] = [];

      if (canHover) {
        q("[data-tilt]").forEach((el: HTMLElement) => {
          const rotX = gsap.quickTo(el, "rotationX", {
            duration: 0.5,
            ease: "power3.out",
          });
          const rotY = gsap.quickTo(el, "rotationY", {
            duration: 0.5,
            ease: "power3.out",
          });
          const lift = gsap.quickTo(el, "z", {
            duration: 0.5,
            ease: "power3.out",
          });

          const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            rotY((px - 0.5) * 14);
            rotX((0.5 - py) * 14);
            lift(30);
            el.style.setProperty("--gx", `${px * 100}%`);
            el.style.setProperty("--gy", `${py * 100}%`);
          };
          const onLeave = () => {
            rotX(0);
            rotY(0);
            lift(0);
          };

          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerleave", onLeave);
          });
        });
      }

      return () => {
        cleanups.forEach((fn) => fn());
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="relative w-full overflow-hidden bg-[#f4f4f1] py-[clamp(80px,12vw,160px)] text-[var(--foreground)]"
    >
      <div
        aria-hidden
        className="absolute -top-[20%] left-1/2 h-[50vmax] w-[50vmax] -translate-x-1/2 rounded-full bg-[var(--primary)] opacity-[0.06] blur-[140px]"
      />

      <ContentContainer className="relative h-auto">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span
              data-eyebrow
              className="mb-4 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-black/60 md:text-sm"
            >
              <span className="h-px w-8 bg-[var(--primary)]" />
              Testimonials
            </span>
            <h2
              id="testimonials-title"
              aria-label={TITLE.map((s) => s.text).join(" ")}
              className="max-w-2xl font-heading text-[clamp(2rem,4.5vw,4.5rem)] leading-[1.08] font-semibold tracking-tight"
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

          <dl className="grid grid-cols-3 gap-6 md:gap-10">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                data-stat
                className="border-l border-black/10 pl-4 md:pl-6"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-heading text-[clamp(1.75rem,3vw,2.75rem)] leading-none font-semibold">
                  <span data-count={stat.value} data-decimals={stat.decimals}>
                    {stat.value.toFixed(stat.decimals)}
                  </span>
                  <span className="text-primary">{stat.suffix}</span>
                </dd>
                <dd
                  aria-hidden
                  className="mt-2 text-xs text-black/50 md:text-sm"
                >
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          data-grid
          className="mt-[clamp(48px,7vw,96px)] grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7"
        >
          {COLUMNS.map((column, c) => (
            <div
              key={c}
              data-column
              className={cn(
                "flex flex-col gap-6 will-change-transform lg:gap-7",
                c === 1 && "lg:pt-16",
              )}
            >
              {column.map((t) => (
                <TestimonialCard key={t.name} t={t} />
              ))}
            </div>
          ))}
        </div>
      </ContentContainer>
    </section>
  );
};

export default Testimonials;
