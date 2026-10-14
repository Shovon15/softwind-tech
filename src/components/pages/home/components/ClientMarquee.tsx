"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContentContainer from "@/components/layout/container/contentContainer";
import { cn } from "@/utils/helpers/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Client = {
  name: string;
  // Placeholder mark. Replace with <Image src="/clients/x.svg" ... /> for real logos.
  mark: ReactNode;
  className?: string;
};

const CLIENTS: Client[] = [
  {
    name: "Northwind",
    mark: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M12 2 22 20H2z" />
      </svg>
    ),
    className: "font-heading font-semibold tracking-tight",
  },
  {
    name: "LUMORA",
    mark: (
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    ),
    className: "font-body font-bold tracking-[0.3em] text-lg",
  },
  {
    name: "vertexa",
    mark: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M12 2 21 7v10l-9 5-9-5V7z" />
      </svg>
    ),
    className: "font-heading font-bold lowercase",
  },
  {
    name: "Quantix",
    mark: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <rect x="2" y="2" width="9" height="9" rx="2" />
        <rect x="13" y="2" width="9" height="9" rx="4.5" />
        <rect x="2" y="13" width="9" height="9" rx="4.5" />
        <rect x="13" y="13" width="9" height="9" rx="2" />
      </svg>
    ),
    className: "font-body font-semibold italic",
  },
  {
    name: "orbitly",
    mark: (
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4.5"
          transform="rotate(-30 12 12)"
        />
        <circle cx="12" cy="12" r="3.5" fill="currentColor" />
      </svg>
    ),
    className: "font-heading font-medium",
  },
  {
    name: "PIXELCRAFT",
    mark: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <rect x="3" y="3" width="6" height="6" />
        <rect x="9" y="9" width="6" height="6" />
        <rect x="15" y="15" width="6" height="6" />
        <rect x="15" y="3" width="6" height="6" opacity=".5" />
      </svg>
    ),
    className: "font-heading font-bold tracking-wider text-base",
  },
  {
    name: "Helio",
    mark: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <circle cx="12" cy="12" r="5" />
        <path
          d="M12 1v4M12 19v4M1 12h4M19 12h4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M4.2 19.8 7 17M17 7l2.8-2.8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    className: "font-heading font-semibold text-2xl",
  },
  {
    name: "nimbus",
    mark: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M7 19a5 5 0 0 1-.6-9.96A6.5 6.5 0 0 1 19 9.5 4.75 4.75 0 0 1 18 19z" />
      </svg>
    ),
    className: "font-body font-bold tracking-tight",
  },
  {
    name: "Cobalt.",
    mark: (
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="M18 6.5A8 8 0 1 0 18 17.5" />
      </svg>
    ),
    className: "font-heading font-bold",
  },
  {
    name: "ZENITH",
    mark: (
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      >
        <path d="M4 5h16L4 19h16" />
      </svg>
    ),
    className: "font-body font-light tracking-[0.25em]",
  },
];

const ROW_ONE = CLIENTS;
const ROW_TWO = [...CLIENTS.slice(5), ...CLIENTS.slice(0, 5)];

const Logo = ({ client }: { client: Client }) => (
  <li className="group flex shrink-0 items-center px-[clamp(20px,3vw,48px)]">
    <div
      className={cn(
        "flex items-center gap-2.5 text-xl whitespace-nowrap text-white/40 transition-colors duration-300 group-hover:text-white md:text-2xl",
        client.className,
      )}
    >
      <span className="text-white/40 transition-colors duration-300 group-hover:text-[var(--primary)]">
        {client.mark}
      </span>
      {client.name}
    </div>
  </li>
);

const MarqueeRow = ({
  clients,
  reverse,
}: {
  clients: Client[];
  reverse?: boolean;
}) => {
  // Each half is the list twice so it always exceeds wide viewports
  const half = [...clients, ...clients];

  return (
    <div className="overflow-hidden py-5 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div
        data-track
        data-reverse={reverse ? "" : undefined}
        className="flex w-max will-change-transform"
      >
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex">
            {half.map((client, i) => (
              <Logo key={`${client.name}-${i}`} client={client} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

const ClientMarquee = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(sectionRef);
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      /* ---------- Infinite loops ---------- */
      const loops = q("[data-track]").map((track: HTMLElement) => {
        const reverse = track.hasAttribute("data-reverse");
        return gsap.fromTo(
          track,
          { xPercent: reverse ? -50 : 0 },
          {
            xPercent: reverse ? 0 : -50,
            duration: 90,
            ease: "none",
            repeat: -1,
          },
        );
      });

      /* ---------- Scroll velocity: speed up + follow scroll direction ---------- */
      let direction = 1;
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          direction = self.direction;
          const boost = gsap.utils.clamp(
            1,
            3,
            1 + Math.abs(self.getVelocity()) / 600,
          );

          loops.forEach((loop) => {
            gsap
              .timeline({ overwrite: true })
              .to(loop, { timeScale: boost * direction, duration: 0.2 })
              .to(loop, {
                timeScale: direction,
                duration: 1.2,
                ease: "power2.out",
              });
          });
        },
      });

      /* ---------- Hover: ease to a stop ---------- */
      const rows = q("[data-rows]")[0] as HTMLElement;
      const slow = (to: number) =>
        loops.forEach((loop) =>
          gsap.to(loop, {
            timeScale: to * direction,
            duration: 0.6,
            overwrite: true,
          }),
        );
      const onEnter = () => slow(0);
      const onLeave = () => slow(1);
      rows.addEventListener("mouseenter", onEnter);
      rows.addEventListener("mouseleave", onLeave);

      /* ---------- Reveal on enter ---------- */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        })
        .from(q("[data-heading]"), { y: 30, autoAlpha: 0, duration: 0.9 })
        .from(
          q("[data-row]"),
          { y: 40, autoAlpha: 0, duration: 1, stagger: 0.15 },
          "-=0.6",
        );

      return () => {
        rows.removeEventListener("mouseenter", onEnter);
        rows.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Our clients"
      className="relative w-full overflow-hidden border-y border-white/5 py-[clamp(56px,8vw,112px)] text-white"
    >
      <ContentContainer>
        <div
          data-heading
          className="mb-10 flex flex-col items-center gap-3 text-center md:mb-14"
        >
          <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-white/60 md:text-sm">
            <span className="h-px w-8 bg-[var(--primary)]" />
            Trusted Worldwide
            <span className="h-px w-8 bg-[var(--primary)]" />
          </span>
          <h2 className="font-heading text-[clamp(1.5rem,3vw,2.5rem)] font-semibold tracking-tight">
            Brands that grow with <span className="text-primary">us</span>
          </h2>
        </div>
      </ContentContainer>

      <div data-rows className="flex flex-col gap-2">
        <div data-row>
          <MarqueeRow clients={ROW_ONE} />
        </div>
        <div data-row>
          <MarqueeRow clients={ROW_TWO} reverse />
        </div>
      </div>
    </section>
  );
};

export default ClientMarquee;
