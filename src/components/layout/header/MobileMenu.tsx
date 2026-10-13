"use client";

import NavLink from "@/components/common/link/NavLink";
import { cn } from "@/utils/helpers/cn";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

interface MobileDropdownProps {
  isOpen: boolean;
  navItems: any[];
  onClose: () => void;
}

const MobileMenu: React.FC<MobileDropdownProps> = ({
  isOpen,
  onClose,
  navItems,
}) => {
  const [openChildren, setOpenChildren] = useState<boolean[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      //   setOpenChildren(new Array(navItems.length).fill(false));
    }
  }, [isOpen]);

  const toggleChildren = (index: number) => {
    setOpenChildren((prev) => {
      const newOpenChildren = [...prev];
      newOpenChildren[index] = !newOpenChildren[index];
      return newOpenChildren;
    });
  };

  const getPath = (slug?: string) => {
    if (!slug || slug === "home") return "/";
    return `/${slug}`;
  };

  const handleRedirect = (item: any) => {
    router.push(getPath(item.slug));
    onClose();
  };

  const handleChildRedirect = (item: any, child: any) => {
    const parentPath = getPath(item.slug);
    const path =
      parentPath === "/" ? `/${child.slug}` : `${parentPath}/${child.slug}`;

    router.push(path);
    onClose();
  };

  return (
    <div
      className={cn(
        "lg:hidden fixed left-0 right-0 top-[0px] pt-[95px] bottom-0 bg-[#000000E5] z-40 overflow-y-auto transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
      data-lenis-prevent
    >
      <div className="flex flex-col pt-10 px-5">
        {navItems.map((item, index) => (
          <div key={index} className="pb-4">
            <div
              // href={`/${item.url}`}
              className="relative flex gap-3 justify-between items-center text-white capitalize py-2 
             font-boldCond font-[400] text-[24px] leading-[22px] tracking-[0]
             after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0
             after:h-px
             after:bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,#F73219_0.21%,rgba(0,0,0,0)_100%)]"
              onClick={
                item.children && item.children.length > 0
                  ? () => toggleChildren(index)
                  : () => handleRedirect(item)
              }
              //   onClick={onClose}
            >
              <span className="" onClick={() => handleRedirect(item)}>
                {item.title}
              </span>

              {item.children && item.children.length > 0 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation(); // prevent Link navigation
                    e.preventDefault(); // prevent Link default behavior
                    toggleChildren(index);
                  }}
                  className={`transform transition-transform duration-300 p-2 ${
                    openChildren[index] ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ArrowIcon />
                </span>
              )}
            </div>
            {item.children && item.children.length > 0 && (
              <div
                className={cn(
                  "transition-all duration-300 ease-in-out overflow-hidden",
                  openChildren[index]
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0",
                )}
                data-lenis-prevent
              >
                {item.children.map((child: any, childIndex: number) => {
                  return (
                    <div
                      // href={`/${item.url}/${child.url}`}
                      key={childIndex}
                      className="relative block py-3 text-white capitalize pl-6 font-boldCond font-[400] text-[20px] leading-[22px] tracking-[0]
             after:content-[''] after:absolute after:bottom-0 after:right-0 after:h-px after:left-6
             after:bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,#F73219_0.21%,rgba(0,0,0,0)_100%)]"
                      onClick={() => {
                        handleChildRedirect(item, child);
                      }}
                    >
                      {child.title}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;

export const ArrowIcon = () => {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.32693 6.33972L7.02566 10.2439C7.28862 10.5215 7.64111 10.6603 7.9936 10.6603C8.34609 10.6603 8.69859 10.5215 8.96154 10.2439L12.6603 6.33972"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
