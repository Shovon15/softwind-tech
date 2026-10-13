"use client";

import ArrowIcon from "@/assets/icons/ArrowIcon";
import LeftArrow from "@/assets/icons/SliderArrowIcon";
// import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  scrollTargetId?: string;
  scrollOffset?: number;
}

export function Pagination({
  totalPages,
  currentPage: controlledPage,
  onPageChange,
  scrollTargetId,
  scrollOffset = -80,
}: PaginationProps) {
  const [internalPage, setInternalPage] = useState(controlledPage ?? 1);
  // Controlled when a `currentPage` prop is supplied, otherwise self-managed.
  const currentPage = controlledPage ?? internalPage;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    setInternalPage(page);
    onPageChange?.(page);

    // Wait until React has committed the new page before starting the scroll.
    // Every pagination control, including Previous and Next, uses this handler.
    if (scrollTargetId) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const target = document.getElementById(scrollTargetId);
          if (!target) return;

          const lenis = (window as any).__lenis;
          if (lenis) {
            lenis.scrollTo(target, {
              offset: scrollOffset,
              duration: 1.1,
              force: true,
            });
            return;
          }

          window.scrollTo({
            top:
              target.getBoundingClientRect().top +
              window.scrollY +
              scrollOffset,
            behavior: "smooth",
          });
        });
      });
    }
  };

  // Calculate which page numbers to show based on screen size
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const siblingCount = 2; // Pages to show on each side of current page

    // Always show first page
    pages.push(1);

    // Calculate start and end of the range around current page
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages - 1,
    );

    // Add left ellipsis if needed
    if (leftSiblingIndex > 2) {
      pages.push("...");
    }

    // Add sibling pages
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pages.push(i);
    }

    // Add right ellipsis if needed
    if (rightSiblingIndex < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  // Compact version for mobile - shows fewer pages
  const compactPageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const siblingCount = 1; // Only 1 sibling on mobile

    pages.push(1);

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages - 1,
    );

    if (leftSiblingIndex > 2) {
      pages.push("...");
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pages.push(i);
    }

    if (rightSiblingIndex < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  const renderPageButton = (
    page: number | string,
    index: number,
    isMobile: boolean = false,
  ) => {
    if (page === "...") {
      return (
        <span
          key={`ellipsis-${index}`}
          className="px-1 sm:px-2 text-neutral-400 text-xs sm:text-sm font-medium"
        >
          ...
        </span>
      );
    }

    const pageNum = page as number;
    const isActive = pageNum === currentPage;

    return (
      <button
        type="button"
        key={pageNum}
        onClick={() => handlePageChange(pageNum)}
        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded font-body  font-medium text-xs lg:text-base transition-all duration-200 ${
          isActive
            ? "bg-[#FDEDF0] text-[#E4002B]  "
            : " text-[#667085]  hover:bg-[#FDEDF0] active:scale-95"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        {pageNum}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-4 py-5  border-t border-[#EAECF0]">
      {/* Desktop view */}
      <div className="hidden sm:flex items-center justify-between gap-3">
        {/* Previous Button */}
        <NavigationButton
          handlePageFuntion={() => handlePageChange(currentPage - 1)}
          text="Previous"
          ariaLabel="Previous page"
          direction="left"
          disabled={currentPage === 1}
        />

        {/* Page Numbers */}
        <div className="flex items-center gap-2">
          {pageNumbers.map((page, index) =>
            renderPageButton(page, index, false),
          )}
        </div>

        {/* Next Button */}
        <NavigationButton
          handlePageFuntion={() => handlePageChange(currentPage + 1)}
          text="Next"
          ariaLabel="Next Page"
          direction="right"
          disabled={currentPage === totalPages}
        />
      </div>

      {/* Mobile view */}
      <div className="sm:hidden flex flex-col items-center justify-center gap-1.5">
        {/* Page Numbers */}
        <div className="flex items-center gap-2">
          {pageNumbers.map((page, index) =>
            renderPageButton(page, index, false),
          )}
        </div>
        <div className=" flex justify-between items-center w-full mt-5">
          {/* Previous Button */}
          <NavigationButton
            handlePageFuntion={() => handlePageChange(currentPage - 1)}
            text="Previous"
            ariaLabel="Previous page"
            direction="left"
            disabled={currentPage === 1}
          />
          {/* Next Button */}
          <NavigationButton
            handlePageFuntion={() => handlePageChange(currentPage + 1)}
            text="Next"
            ariaLabel="Next Page"
            direction="right"
            disabled={currentPage === totalPages}
          />
        </div>
      </div>
    </div>
  );
}

const NavigationButton = ({
  handlePageFuntion,
  disabled,
  ariaLabel,
  text,
  direction,
}: any) => {
  return (
    <button
      type="button"
      onClick={handlePageFuntion}
      disabled={disabled}
      className="flex items-center font-body font-medium text-xs lg:text-base gap-2 justify-center  disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 text-[#667085] hover:text-[#E4002B]"
      aria-label={ariaLabel}
    >
      {direction === "left" && (
        <ArrowIcon className="w-3 h-3" direction={direction} />
      )}
      {text}
      {direction === "right" && (
        <ArrowIcon className="w-3 h-3" direction={direction} />
      )}
    </button>
  );
};
