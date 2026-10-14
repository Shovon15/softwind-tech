"use client";

import { Fragment, useId, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContentContainer from "@/components/layout/container/contentContainer";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import NavLink from "@/components/common/link/NavLink";
import routes from "@/config/routes";
import { cn } from "@/utils/helpers/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TITLE: { text: string; highlight?: boolean }[] = [
  { text: "Have Questions? We Have Got You" },
  { text: "Covered!", highlight: true },
];

const TITLE_WORDS = TITLE.flatMap((segment) =>
  segment.text
    .split(" ")
    .map((word) => ({ word, highlight: segment.highlight })),
);

const FAQS = [
  {
    question: "How much does a typical project cost?",
    answer:
      "Every project is different, so we price based on scope, complexity and timeline. After a free discovery call we send a detailed estimate with clear milestones, so there are no surprises later.",
  },
  {
    question: "How long does it take to build a product?",
    answer:
      "A marketing website usually takes 3–6 weeks, while an MVP web or mobile app takes around 8–14 weeks. We share a week-by-week plan before we start and demo progress every week.",
  },
  {
    question: "Which technologies do you work with?",
    answer:
      "We mainly use Next.js, React, React Native, Node.js, Laravel and Flutter, with AWS and Docker for infrastructure. We always pick the stack that best fits your product, team and budget.",
  },
  {
    question: "Do you offer support after launch?",
    answer:
      "Yes. We offer flexible maintenance plans covering monitoring, bug fixes, security updates and new features, so your product keeps improving long after launch day.",
  },
  {
    question: "Who owns the code and intellectual property?",
    answer:
      "You do. Once the project is paid for, all source code, designs and IP belong to you. We are happy to sign an NDA before any discussion.",
  },
  {
    question: "Can you work with clients in different time zones?",
    answer:
      "Absolutely. We have worked with clients in 12 countries and keep a few overlapping hours every day for calls, plus async updates through Slack, Jira or your preferred tools.",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

const FaqItem = ({
  index,
  question,
  answer,
  open,
  onToggle,
}: {
  index: number;
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  // Closed styles come from the first render only; after that GSAP owns height/opacity,
  // otherwise React would drop the classes before the tween and the panel would jump
  const [initiallyOpen] = useState(open);
  const id = useId();

  useGSAP(
    () => {
      const panel = panelRef.current!;
      const text = panel.firstElementChild;

      // Initial markup already reflects the state; only animate toggles
      if (isFirstRender.current) {
        isFirstRender.current = false;
        gsap.set(panel, { height: open ? "auto" : 0 });
        return;
      }

      if (open) {
        gsap.to(panel, { height: "auto", duration: 0.6, ease: "power3.inOut" });
        gsap.fromTo(
          text,
          { y: 16, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.5,
            delay: 0.15,
            ease: "power2.out",
          },
        );
      } else {
        gsap.to(text, { autoAlpha: 0, duration: 0.2 });
        gsap.to(panel, { height: 0, duration: 0.5, ease: "power3.inOut" });
      }
    },
    { dependencies: [open] },
  );

  return (
    <div
      data-faq
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition-colors duration-500",
        open
          ? "border-[var(--primary)]/40 bg-white/[0.06]"
          : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]",
      )}
    >
      {/* Active accent bar */}
      <span
        aria-hidden
        className={cn(
          "absolute top-0 bottom-0 left-0 w-[3px] origin-top bg-[var(--primary)] transition-transform duration-500",
          open ? "scale-y-100" : "scale-y-0",
        )}
      />

      <h3>
        <button
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex w-full cursor-pointer items-center gap-4 px-5 py-5 text-left md:gap-6 md:px-7 md:py-6"
        >
          <span
            className={cn(
              "font-heading text-sm transition-colors duration-500",
              open ? "text-[var(--primary)]" : "text-white/35",
            )}
          >
            {pad(index + 1)}
          </span>
          <span className="flex-1 font-heading text-base font-medium md:text-lg">
            {question}
          </span>

          {/* Plus that rotates into a close icon */}
          <span
            aria-hidden
            className={cn(
              "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
              open
                ? "rotate-[135deg] border-[var(--primary)] bg-[var(--primary)] text-white"
                : "border-white/20 text-white/70 group-hover:border-white/50 group-hover:text-white",
            )}
          >
            <span className="absolute h-[1.5px] w-3.5 rounded-full bg-current" />
            <span className="absolute h-3.5 w-[1.5px] rounded-full bg-current" />
          </span>
        </button>
      </h3>

      <div
        ref={panelRef}
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        className={cn("overflow-hidden", !initiallyOpen && "h-0")}
      >
        <p
          className={cn(
            "px-5 pb-6 pl-[calc(1.25rem+2.25rem)] text-sm leading-relaxed text-white/60 md:px-7 md:pb-7 md:pl-[calc(1.75rem+3rem)] md:text-base",
            !initiallyOpen && "invisible opacity-0",
          )}
        >
          {answer}
        </p>
      </div>
    </div>
  );
};

const Faq = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(sectionRef);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Left column: heading reveal follows the scroll (reverses on scroll up)
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1.2,
          },
        })
        .from(q("[data-eyebrow]"), { y: 20, autoAlpha: 0, duration: 0.3 })
        .from(
          q("[data-title-word]"),
          { yPercent: 110, duration: 0.5, stagger: 0.06, ease: "power3.out" },
          0.1,
        )
        .from(
          q("[data-intro]"),
          { y: 30, autoAlpha: 0, duration: 0.4, stagger: 0.1 },
          0.45,
        );

      // Right column: questions slide in from the right one by one
      q("[data-faq]").forEach((item: HTMLElement) => {
        gsap.from(item, {
          x: 80,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="faq"
      aria-labelledby="faq-title"
      className="relative w-full overflow-hidden py-[clamp(80px,12vw,160px)] text-white"
    >
      <div
        aria-hidden
        className="absolute -right-[15%] top-[10%] h-[50vmax] w-[50vmax] rounded-full bg-[var(--primary)] opacity-[0.08] blur-[150px]"
      />

      <ContentContainer className="relative h-auto">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: heading (sticky while the questions scroll) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[clamp(110px,14vh,160px)]">
              <span
                data-eyebrow
                className="mb-4 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-white/60 md:text-sm"
              >
                <span className="h-px w-8 bg-[var(--primary)]" />
                FAQ
              </span>
              <h2
                id="faq-title"
                aria-label={TITLE.map((s) => s.text).join(" ")}
                className="font-heading text-[clamp(2rem,4vw,4rem)] leading-[1.08] font-semibold tracking-tight"
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

              <p
                data-intro
                className="mt-6 max-w-md text-base leading-relaxed text-white/60"
              >
                Everything you need to know about working with us. Can&apos;t
                find the answer you&apos;re looking for? Our team is happy to
                help.
              </p>

              <div
                data-intro
                className="mt-10 flex max-w-md items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/15 text-[var(--primary)]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a8 8 0 0 1-11.8 7L3 21l2-6.2A8 8 0 1 1 21 12z" />
                  </svg>
                </span>
                <div className="flex-1">
                  <p className="font-heading text-sm font-semibold md:text-base">
                    Still have questions?
                  </p>
                  <p className="text-xs text-white/50 md:text-sm">
                    We usually reply within 24 hours.
                  </p>
                </div>
                <NavLink href={routes.contact} hover={false}>
                  <PrimaryButton as="span" innerClassName="px-5 py-2.5 text-sm">
                    Contact us
                  </PrimaryButton>
                </NavLink>
              </div>
            </div>
          </div>

          {/* Right: accordion */}
          <div className="flex flex-col gap-4 lg:col-span-7">
            {FAQS.map((faq, i) => (
              <FaqItem
                key={faq.question}
                index={i}
                question={faq.question}
                answer={faq.answer}
                open={openIndex === i}
                onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
              />
            ))}
          </div>
        </div>
      </ContentContainer>
    </section>
  );
};

export default Faq;
