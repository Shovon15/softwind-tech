"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import NavLink from "@/components/common/link/NavLink";
import { cn } from "@/utils/helpers/cn";

type Props = {
  navItems: any;
};

const NavItems = ({ navItems }: Props) => {
  const pathname = usePathname();
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const getPath = (slug: string) => (slug === "home" ? "/" : `/${slug}`);
  const activeIndex = navItems.findIndex((item: any) => {
    const path = getPath(item.slug);
    return (
      pathname === path || (path !== "/" && pathname.startsWith(`${path}/`))
    );
  });

  // Slide the pill highlight under the given item (or hide it)
  const moveIndicator = (index: number, instant = false) => {
    const el = itemRefs.current[index];
    const indicator = indicatorRef.current;
    if (!indicator) return;
    if (!el) {
      gsap.to(indicator, { autoAlpha: 0, scale: 0.8, duration: 0.3 });
      return;
    }
    gsap.to(indicator, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      autoAlpha: 1,
      scale: 1,
      duration: instant ? 0 : 0.5,
      ease: "power3.out",
    });
  };

  // Rest on the active route when nothing is hovered
  useEffect(() => {
    moveIndicator(activeIndex, true);
  }, [activeIndex]);

  return (
    <nav
      className="relative hidden h-full items-center lg:flex"
      onMouseLeave={() => moveIndicator(activeIndex)}
    >
      <span
        ref={indicatorRef}
        aria-hidden
        className="invisible absolute top-1/2 left-0 h-[42px] -translate-y-1/2 rounded-full bg-white/10 opacity-0 ring-1 ring-white/15"
      />

      {navItems.map((item: any, index: number) => {
        const linkPath = getPath(item.slug);
        const isActive = index === activeIndex;
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openDropdown === index;

        return (
          <div
            key={item.slug}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="relative"
            onMouseEnter={() => {
              moveIndicator(index);
              if (hasChildren) setOpenDropdown(index);
            }}
            onMouseLeave={() => hasChildren && setOpenDropdown(null)}
          >
            <NavLink
              href={linkPath}
              hover={false}
              className={cn(
                "group relative z-10 flex h-[42px] items-center gap-1.5 rounded-full px-[clamp(14px,1.2vw,22px)] font-body text-[15px] font-medium whitespace-nowrap transition-colors duration-300",
                isActive ? "text-white" : "text-white/65 hover:text-white",
              )}
            >
              {/* Text rolls up on hover */}
              <span className="relative block overflow-hidden">
                <span className="block transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:-translate-y-full">
                  {item.title}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-y-0"
                >
                  {item.title}
                </span>
              </span>

              {hasChildren && (
                <svg
                  viewBox="0 0 24 24"
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              )}

              {isActive && (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--primary)]" />
              )}
            </NavLink>

            {hasChildren && (
              <div
                className={cn(
                  "absolute top-full left-1/2 z-30 min-w-[210px] -translate-x-1/2 pt-4 transition-all duration-300",
                  isOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-2 opacity-0",
                )}
              >
                <div className="rounded-2xl border border-white/10 bg-[#0c1a1a]/95 p-2 shadow-2xl backdrop-blur-xl">
                  {item.children.map((child: any) => (
                    <NavLink
                      key={child.slug}
                      href={`${linkPath}/${child.slug}`}
                      hover={false}
                      onClick={() => setOpenDropdown(null)}
                      className="block rounded-xl px-4 py-2.5 text-sm text-white/70 transition-colors duration-200 hover:bg-white/5 hover:text-white"
                    >
                      {child.title}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default NavItems;
