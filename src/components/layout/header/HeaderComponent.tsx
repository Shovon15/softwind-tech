"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContentContainer from "../container/contentContainer";
import Hamburger from "./hamburger/Hamburger";
import MobileMenu from "./MobileMenu";
import NavItems from "./NavItems";
import PAGES from "@/dummyData";
import NavLink from "@/components/common/link/NavLink";
import routes from "@/config/routes";
import { SITE_INFORMATION } from "@/config/seo";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setFetchedStatus,
  setNavigation,
} from "@/store/slices/navigationSlice";
import { normalizeSiteInfoNavigation } from "@/hooks/useNavigationData";
import { cn } from "@/utils/helpers/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const emptySubscribe = () => () => {};

const HeaderComponent = ({ data }: any) => {
  const dispatch = useAppDispatch();
  const { header } = useAppSelector((state) => state.navigation);
  const navItems = header.items.length ? header.items : PAGES.header.items;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const menuOpenRef = useRef(false);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!data) return;

    dispatch(setNavigation(normalizeSiteInfoNavigation(data)));
    dispatch(setFetchedStatus(true));
  }, [data, dispatch]);

  useEffect(() => {
    menuOpenRef.current = isMobileMenuOpen;
  }, [isMobileMenuOpen]);

  useGSAP(
    () => {
      if (!mounted) return;
      const q = gsap.utils.selector(headerRef);
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /* ---------- Intro: drops in, pill opens from the center, items rise ---------- */
      if (!reduceMotion) {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(headerRef.current, { yPercent: -160, duration: 1.1 })
          .fromTo(
            headerRef.current,
            { clipPath: "inset(0% 42% 0% 42% round 999px)" },
            { clipPath: "inset(0% 0% 0% 0% round 999px)", duration: 1.2 },
            0.35,
          )
          .from(
            q("[data-intro]"),
            {
              y: 24,
              autoAlpha: 0,
              duration: 0.8,
              stagger: 0.08,
              ease: "power3.out",
            },
            0.75,
          )
          .set(headerRef.current, { clearProps: "clipPath" });
      }

      /* ---------- Hide on scroll down, reveal on scroll up ---------- */
      let hidden = false;
      const show = () => {
        if (!hidden) return;
        hidden = false;
        gsap.to(wrapperRef.current, {
          yPercent: 0,
          duration: 0.7,
          ease: "power3.out",
          overwrite: true,
        });
      };
      const hide = () => {
        if (hidden || menuOpenRef.current) return;
        hidden = true;
        gsap.to(wrapperRef.current, {
          yPercent: -150,
          duration: 0.6,
          ease: "power3.inOut",
          overwrite: true,
        });
      };

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          setScrolled(y > 60);
          if (y < 140) show();
          else if (self.direction === 1) hide();
          else show();
        },
      });
    },
    { dependencies: [mounted] },
  );

  if (!mounted) return null;

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <div
        ref={wrapperRef}
        className="fixed top-3 left-0 z-50 w-full will-change-transform lg:top-5"
      >
        {/* Header keeps the wider gutter; page content uses the narrower default */}
        <ContentContainer className="h-auto md:px-[4vw] 2xl:px-[6vw]">
          <header
            ref={headerRef}
            className={cn(
              "relative flex items-center justify-between rounded-full border pr-2 pl-5 transition-all duration-500 ease-out md:pl-7",
              scrolled
                ? "h-[60px] border-white/10 bg-[#081212]/85 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:h-[64px]"
                : "h-[64px] border-white/15 bg-[#081212]/55 backdrop-blur-md lg:h-[76px]",
            )}
          >
            {/* Animated gradient border sheen */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
            >
              <span className="header-sheen absolute top-0 left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />
            </span>

            {/* Logo */}
            <div data-intro className="flex shrink-0 items-center">
              <NavLink
                href={routes.home}
                hover={false}
                ariaLabel={`${SITE_INFORMATION.appName} home`}
                onClick={closeMenu}
              >
                <Image
                  src="/Softwind-tech-white.svg"
                  alt={SITE_INFORMATION.appName}
                  width={963}
                  height={290}
                  priority
                  className={cn(
                    "h-auto transition-all duration-500",
                    scrolled
                      ? "w-[118px] lg:w-[132px]"
                      : "w-[128px] lg:w-[150px]",
                  )}
                />
              </NavLink>
            </div>

            {/* Nav */}
            <div
              data-intro
              className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
            >
              {navItems.length > 0 && <NavItems navItems={navItems} />}
            </div>

            {/* Right */}
            <div data-intro className="flex items-center gap-2">
              <NavLink
                href={routes.contact}
                hover={false}
                onClick={closeMenu}
                className="group relative hidden h-[46px] items-center gap-3 overflow-hidden rounded-full bg-[var(--primary)] pr-1.5 pl-6 text-sm font-semibold text-white sm:flex lg:h-[52px]"
              >
                {/* White fill sweeps in on hover */}
                <span className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-x-100" />
                <span className="relative block overflow-hidden transition-colors duration-500 group-hover:text-[#081212]">
                  <span className="block transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:-translate-y-full">
                    Let&apos;s Talk
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-y-0"
                  >
                    Let&apos;s Talk
                  </span>
                </span>
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--primary)] transition-all duration-500 group-hover:bg-[var(--primary)] group-hover:text-white lg:h-10 lg:w-10">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </NavLink>

              <button
                type="button"
                aria-label={
                  isMobileMenuOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/15 bg-white/5 p-2.5 text-white focus:outline-none lg:hidden"
              >
                <Hamburger isOpen={isMobileMenuOpen} />
              </button>
            </div>
          </header>
        </ContentContainer>
      </div>

      {/* Outside the transformed wrapper so `fixed` stays relative to the viewport */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        navItems={navItems}
        onClose={closeMenu}
      />
    </>
  );
};

export default HeaderComponent;
