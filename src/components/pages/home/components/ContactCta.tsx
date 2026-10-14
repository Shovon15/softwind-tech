"use client";

import { Fragment, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContentContainer from "@/components/layout/container/contentContainer";
import NavLink from "@/components/common/link/NavLink";
import routes from "@/config/routes";
import { cn } from "@/utils/helpers/cn";
import { CONTACT_INFO } from "@/config/static";

const CONTACT_EMAIL = CONTACT_INFO.email;

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TITLE_LINES: { text: string; highlight?: boolean }[][] = [
  [{ text: "Have an idea?" }],
  [{ text: "Let's" }, { text: "build", highlight: true }, { text: "it." }],
];

const ContactCta = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  useGSAP(
    () => {
      const q = gsap.utils.selector(sectionRef);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      /* ---------- Card expands into view, content rises (scrubbed, reverses) ---------- */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top 15%",
            scrub: 1.2,
          },
        })
        .fromTo(
          q("[data-cta-card]"),
          { scale: 0.86, borderRadius: 80, y: 80 },
          { scale: 1, borderRadius: 32, y: 0, ease: "power2.out", duration: 1 },
          0,
        )
        .from(
          q("[data-eyebrow]"),
          { y: 20, autoAlpha: 0, duration: 0.25 },
          0.45,
        )
        .from(
          q("[data-title-word]"),
          {
            yPercent: 115,
            rotate: 4,
            duration: 0.4,
            stagger: 0.06,
            ease: "power3.out",
          },
          0.5,
        )
        .from(
          q("[data-cta-item]"),
          { y: 40, autoAlpha: 0, duration: 0.35, stagger: 0.08 },
          0.75,
        );

      /* ---------- Rotating rings ---------- */
      gsap.to(q("[data-ring]"), {
        rotate: (i) => (i % 2 ? -360 : 360),
        duration: (i) => 40 + i * 20,
        ease: "none",
        repeat: -1,
      });

      /* ---------- Magnetic button ---------- */
      if (!window.matchMedia("(hover: hover)").matches) return;

      const area = q("[data-magnet-area]")[0] as HTMLElement;
      const magnet = q("[data-magnet]")[0] as HTMLElement;
      const label = q("[data-magnet-label]")[0] as HTMLElement;
      const xTo = gsap.quickTo(magnet, "x", {
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });
      const yTo = gsap.quickTo(magnet, "y", {
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });
      const lxTo = gsap.quickTo(label, "x", {
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });
      const lyTo = gsap.quickTo(label, "y", {
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });

      const onMove = (e: PointerEvent) => {
        const r = magnet.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(dx * 0.35);
        yTo(dy * 0.35);
        // Label moves a bit further for a layered feel
        lxTo(dx * 0.15);
        lyTo(dy * 0.15);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
        lxTo(0);
        lyTo(0);
      };

      area.addEventListener("pointermove", onMove);
      area.addEventListener("pointerleave", onLeave);
      return () => {
        area.removeEventListener("pointermove", onMove);
        area.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-title"
      className="relative w-full overflow-hidden pt-[clamp(40px,6vw,80px)] pb-[clamp(60px,8vw,120px)]"
    >
      <ContentContainer className="h-auto">
        <div
          data-cta-card
          className="relative isolate overflow-hidden rounded-[32px] bg-[var(--primary)] px-6 py-16 text-white will-change-transform md:px-14 md:py-24 lg:px-20 lg:py-28"
        >
          {/* Decorative background */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_10%_100%,rgba(0,0,0,0.25),transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_80%_50%,black_10%,transparent_65%)]" />
            {[0, 1].map((i) => (
              <div
                key={i}
                data-ring
                className={cn(
                  "absolute top-1/2 right-[-12%] -translate-y-1/2 rounded-full border border-dashed border-white/25",
                  i === 0
                    ? "h-[min(70vw,640px)] w-[min(70vw,640px)]"
                    : "right-[-4%] h-[min(48vw,440px)] w-[min(48vw,440px)] border-white/20",
                )}
              />
            ))}
          </div>

          <div className="grid items-end gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span
                data-eyebrow
                className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] backdrop-blur md:text-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                Contact Us
              </span>

              <h2
                id="contact-title"
                aria-label="Have an idea? Let's build it."
                className="font-heading text-[clamp(2.75rem,7vw,7rem)] leading-[1] font-semibold tracking-tight"
              >
                {TITLE_LINES.map((line, l) => (
                  <span key={l} aria-hidden className="block">
                    {line.map((segment, s) => (
                      <Fragment key={s}>
                        {segment.text.split(" ").map((word, w) => (
                          <Fragment key={w}>
                            <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                              <span
                                data-title-word
                                className={cn(
                                  "inline-block origin-bottom-left",
                                  segment.highlight &&
                                    "font-light italic text-[#081212]",
                                )}
                              >
                                {word}
                              </span>
                            </span>{" "}
                          </Fragment>
                        ))}
                      </Fragment>
                    ))}
                  </span>
                ))}
              </h2>

              {/* Email */}
              <div
                data-cta-item
                className="mt-10 flex flex-wrap items-center gap-3 md:mt-14"
              >
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="group/mail relative font-heading text-[clamp(1.25rem,2.6vw,2.25rem)] font-medium"
                >
                  {CONTACT_EMAIL}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-right scale-x-100 bg-white/40" />
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-white transition-transform duration-500 group-hover/mail:scale-x-100" />
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  className="relative flex h-10 cursor-pointer items-center gap-2 overflow-hidden rounded-full border border-white/30 px-4 text-xs font-medium transition-colors duration-300 hover:bg-white hover:text-[var(--primary)]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    {copied ? (
                      <path d="m5 12 5 5L20 7" />
                    ) : (
                      <>
                        <rect x="9" y="9" width="12" height="12" rx="2" />
                        <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                      </>
                    )}
                  </svg>
                  <span aria-live="polite">{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Magnetic CTA */}
            <div
              data-cta-item
              data-magnet-area
              className="flex justify-start p-6 lg:col-span-4 lg:justify-end lg:p-10"
            >
              <NavLink
                href={routes.contact}
                hover={false}
                ariaLabel="Go to contact page"
              >
                <span
                  data-magnet
                  className="group/btn relative flex h-[clamp(140px,14vw,200px)] w-[clamp(140px,14vw,200px)] items-center justify-center overflow-hidden rounded-full bg-white text-[#081212] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)]"
                >
                  {/* Fill that rises on hover */}
                  <span className="absolute inset-0 translate-y-full rounded-full bg-[#081212] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover/btn:translate-y-0" />
                  <span
                    data-magnet-label
                    className="relative flex flex-col items-center gap-2 font-heading text-sm font-semibold transition-colors duration-500 group-hover/btn:text-white md:text-base"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-6 w-6 -rotate-45 transition-transform duration-500 group-hover/btn:rotate-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                    Get in touch
                  </span>
                </span>
              </NavLink>
            </div>
          </div>
        </div>
      </ContentContainer>
    </section>
  );
};

export default ContactCta;
