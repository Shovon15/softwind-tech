"use client";

import { Fragment, useRef, type ComponentType } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContentContainer from "../container/contentContainer";
import NavLink from "@/components/common/link/NavLink";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  PinterestIcon,
  WhatsAppIcon,
  XIcon,
  YoutubeIcon,
} from "@/assets/icons";
import routes from "@/config/routes";
import { SITE_INFORMATION } from "@/config/seo";
import { CONTACT_INFO } from "@/config/static";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/utils/helpers/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TITLE: { text: string; highlight?: boolean }[] = [
  { text: "Let’s Build Your" },
  { text: "Dream", highlight: true },
  { text: "Solution" },
];

const TITLE_WORDS = TITLE.flatMap((segment) =>
  segment.text
    .split(" ")
    .map((word) => ({ word, highlight: segment.highlight })),
);

// Icon components declare an unused `props` prop, so they are not plain ComponentType
// Fractal-noise SVG used as a subtle film grain over the footer background
const GRAIN =
  'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%272%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")';

const SOCIAL_ICONS: Record<string, ComponentType<any>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  pinterest: PinterestIcon,
  whatsapp: WhatsAppIcon,
  x: XIcon,
  twitter: XIcon,
  youtube: YoutubeIcon,
};

// Used until the CMS provides social links. TODO: replace with real profile URLs
const FALLBACK_SOCIALS = [
  { name: "Facebook", url: "https://facebook.com" },
  { name: "LinkedIn", url: "https://linkedin.com" },
  { name: "Instagram", url: "https://instagram.com" },
  { name: "X", url: "https://x.com" },
];

const LINK_COLUMNS: {
  title: string;
  links: { label: string; href: string }[];
}[] = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: routes.home },
      { label: "Services", href: "/#services" },
      { label: "Selected Work", href: "/#selected-work" },
      { label: "Our Process", href: "/#process" },
      { label: "Blog", href: routes.blog },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: routes.about },
      { label: "Testimonials", href: "/#testimonials" },
      { label: "Contact", href: routes.contact },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: routes.faq },
      { label: "Terms & Conditions", href: routes.termsAndConditions },
      { label: "Privacy Policy", href: routes.privacyPolicy },
    ],
  },
];

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const { socialLinks } = useAppSelector((state) => state.navigation);
  const socials = (
    socialLinks.items.length ? socialLinks.items : FALLBACK_SOCIALS
  ).filter((s) => s.url && SOCIAL_ICONS[s.name?.trim().toLowerCase()]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(footerRef);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
        .from(q("[data-title-word]"), {
          yPercent: 110,
          duration: 0.9,
          stagger: 0.07,
        })
        .from(
          q("[data-fade]"),
          { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.08 },
          0.3,
        )
        .from(
          q("[data-social]"),
          {
            scale: 0,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.06,
            ease: "back.out(2)",
          },
          0.5,
        )
        .from(
          q("[data-col]"),
          { y: 40, autoAlpha: 0, duration: 0.8, stagger: 0.1 },
          0.35,
        );

      /* ---------- Aurora blobs drift endlessly ---------- */
      q("[data-blob]").forEach((blob: HTMLElement, i: number) => {
        gsap.to(blob, {
          xPercent: gsap.utils.random(-25, 25),
          yPercent: gsap.utils.random(-20, 20),
          scale: gsap.utils.random(0.85, 1.25),
          rotate: gsap.utils.random(-40, 40),
          duration: 8 + i * 3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      /* ---------- Cursor spotlight ---------- */
      if (!window.matchMedia("(hover: hover)").matches) return;
      const footer = footerRef.current!;
      const spot = q("[data-spotlight]")[0] as HTMLElement;
      const xTo = gsap.quickTo(spot, "x", {
        duration: 0.8,
        ease: "power3.out",
      });
      const yTo = gsap.quickTo(spot, "y", {
        duration: 0.8,
        ease: "power3.out",
      });

      const onMove = (e: PointerEvent) => {
        const r = footer.getBoundingClientRect();
        xTo(e.clientX - r.left);
        yTo(e.clientY - r.top);
        gsap.to(spot, { autoAlpha: 1, duration: 0.4, overwrite: "auto" });
      };
      const onLeave = () => gsap.to(spot, { autoAlpha: 0, duration: 0.6 });

      footer.addEventListener("pointermove", onMove);
      footer.addEventListener("pointerleave", onLeave);
      return () => {
        footer.removeEventListener("pointermove", onMove);
        footer.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: footerRef },
  );

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden bg-[#081212] text-white"
    >
      {/* ---------- Background ---------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Aurora blobs */}
        <div
          data-blob
          className="absolute -bottom-[25%] -left-[10%] h-[40vmax] w-[40vmax] rounded-full bg-[var(--primary)] opacity-30 blur-[120px]"
        />
        <div
          data-blob
          className="absolute -top-[30%] right-[5%] h-[35vmax] w-[35vmax] rounded-full bg-[#14b8a6] opacity-[0.18] blur-[130px]"
        />
        <div
          data-blob
          className="absolute top-[30%] left-[40%] h-[25vmax] w-[25vmax] rounded-full bg-[#f97316] opacity-[0.12] blur-[110px]"
        />

        {/* Dot grid, faded toward the edges */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[size:26px_26px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />

        {/* Cursor spotlight */}
        <div
          data-spotlight
          className="invisible absolute top-0 left-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(230,31,37,0.22),transparent_65%)] opacity-0"
        />

        {/* Glowing top edge */}
        <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-70" />
        <div className="absolute top-0 left-1/2 h-24 w-2/3 -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(230,31,37,0.25),transparent_70%)]" />

        {/* Subtle grain for depth */}
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
      </div>

      <ContentContainer className="relative h-auto">
        <div className="grid gap-14 border-t border-white/10 pt-[clamp(56px,7vw,100px)] pb-14 lg:grid-cols-12 lg:gap-10">
          {/* Left: title, logo, socials, address */}
          <div className="lg:col-span-6">
            <h2 className="font-heading text-[clamp(2rem,4vw,3.75rem)] leading-[1.08] font-semibold tracking-tight">
              {TITLE_WORDS.map(({ word, highlight }, i) => (
                <Fragment key={i}>
                  <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
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

            <div data-fade className="mt-10">
              <NavLink
                href={routes.home}
                hover={false}
                ariaLabel={`${SITE_INFORMATION.appName} home`}
              >
                <Image
                  src="/Softwind-tech-white.svg"
                  alt={SITE_INFORMATION.appName}
                  width={963}
                  height={290}
                  className="h-auto w-[clamp(150px,14vw,210px)]"
                />
              </NavLink>
            </div>

            <ul className="mt-8 flex flex-wrap gap-3">
              {socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.name.trim().toLowerCase()];
                return (
                  <li key={social.name} data-social>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:bg-[var(--primary)] [&_svg]:h-[18px] [&_svg]:w-[18px]"
                    >
                      <Icon />
                    </a>
                  </li>
                );
              })}
            </ul>

            <address
              data-fade
              className="mt-8 flex max-w-sm items-start gap-3 text-sm leading-relaxed text-white/60 not-italic md:text-base"
            >
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
              {CONTACT_INFO.address}
            </address>
          </div>

          {/* Right: link columns */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:pl-10"
          >
            {LINK_COLUMNS.map((column) => (
              <div key={column.title} data-col>
                <h3 className="mb-5 font-heading text-xs font-medium uppercase tracking-[0.2em] text-white/45 md:mb-6 md:text-sm">
                  {column.title}
                </h3>
                <ul className="space-y-3.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <NavLink
                        href={link.href}
                        hover={false}
                        className="group/link inline-flex items-center gap-2 text-sm text-white/75 transition-colors duration-300 hover:text-white md:text-base"
                      >
                        <span className="h-px w-0 bg-[var(--primary)] transition-all duration-300 group-hover/link:w-4" />
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-white/50 md:flex-row md:text-sm">
          <p>
            © {new Date().getFullYear()} {SITE_INFORMATION.appName}. All rights
            reserved.
          </p>
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="transition-colors duration-300 hover:text-white"
          >
            {CONTACT_INFO.email}
          </a>
        </div>
      </ContentContainer>
    </footer>
  );
};

export default Footer;
