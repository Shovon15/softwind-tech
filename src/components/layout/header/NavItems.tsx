"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import NavLink from "@/components/common/link/NavLink";
import { cn } from "@/utils/helpers/cn";
import { ArrowIcon } from "./MobileMenu";

type Props = {
  navItems: any;
};

const NavItems = ({ navItems }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  // Track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // const toggleDropdown = (index: number) => {
  //   setOpenDropdown(openDropdown === index ? null : index);
  // };

  const handleChildRedirect = (item: any, child: any) => {
    if (item && child) {
      router.push(`/${item.slug}/${child.slug}`);
      setOpenDropdown(null);
    }
  };

  return (
    <nav className="relative hidden lg:flex gap-1 xl:gap-[6px] h-full">
      {navItems.map((item: any, index: number) => {
        const linkPath = item.slug === "home" ? "/" : `/${item.slug}`;

        const isActive =
          pathname === linkPath || pathname.startsWith(`${linkPath}/`);

        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openDropdown === index;

        return (
          <div
            key={item.slug}
            className="relative my-auto"
            onMouseEnter={() => hasChildren && setOpenDropdown(index)}
            onMouseLeave={() => hasChildren && setOpenDropdown(null)}
          >
            <NavLink
              href={linkPath}
              className={cn(
                "relative z-20 flex items-center justify-center cursor-pointer",
                "font-body transition-nav duration-200 ease-smooth",
                "whitespace-nowrap group leading-[22px]  rounded-full",
                "text-[clamp(13px,1.302vw,20px)] xl:text-[clamp(13px,1.102vw,20px)]",
                "px-[clamp(8px,0.9vw,18px)] py-[clamp(2px,0.42vw,8px)]  ",
                isActive
                  ? "text-primary bg-[#F5F5F5] font-bold"
                  : "text-foreground hover:!text-[#e4002b] hover:bg-[#F5F5F5] font-medium",
              )}
            >
              {item.title}
              {hasChildren && (
                <span
                  className={cn(
                    "ml-2 transform transition-transform duration-300",
                    isOpen ? "rotate-180" : "rotate-0",
                    "group-hover:[&>svg_path]:stroke-white",
                  )}
                >
                  <ArrowIcon />
                </span>
              )}
            </NavLink>

            {hasChildren && (
              <div className="relative pb-3">
                <div
                  className={cn(
                    "absolute left-0 top-full min-w-[170px] bg-[#1D242580] shadow-md transition-all duration-300 overflow-visible z-30 ",
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible",
                  )}
                >
                  {item.children.map((child: any, childIndex: number) => (
                    <div
                      key={childIndex}
                      className={cn(
                        "relative block px-4 py-2 text-[20px] font-boldCond text-foreground hover:opacity-90 cursor-pointer uppercase hover:bg-[#E1251B]",
                        "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px",
                        "after:bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,#F73219_0.21%,rgba(0,0,0,0)_100%)]",
                        childIndex === item.children.length - 1 &&
                          "after:hidden",
                      )}
                      onClick={() => handleChildRedirect(item, child)}
                    >
                      {child.title}
                    </div>
                  ))}

                  {/* Arrow */}
                  <div className="absolute top-[-13%] left-[10%] z-90">
                    <DropdownArrowIcon />
                  </div>
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

const DropdownArrowIcon = () => {
  return (
    <svg
      width="22"
      height="12"
      viewBox="0 0 22 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.8253 0L21.6506 12H0L10.8253 0Z"
        fill="#1D2425"
        fillOpacity="0.5"
      />
    </svg>
  );
};
