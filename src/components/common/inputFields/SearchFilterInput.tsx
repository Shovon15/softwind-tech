"use client";

import { cn } from "@/utils/helpers/cn";
import React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  /** Number of matches, rendered under the field while a query is typed. */
  resultCount?: number;
  resultNoun?: { singular: string; plural: string };
  /** Applied to the input, so other sections can focus it after scrolling. */
  inputId?: string;
  className?: string;
};

const SearchFilterInput = ({
  value,
  onChange,
  placeholder = "Search...",
  ariaLabel = "Search",
  resultCount,
  resultNoun = { singular: "result", plural: "results" },
  inputId,
  className,
}: Props) => {
  const keyword = value.trim();
  const hasQuery = keyword.length > 0;

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="group/search flex w-full max-w-[560px] items-center gap-3 rounded-full bg-[#F2F2F2] px-5 py-3 ring-1 ring-transparent transition-all duration-300 focus-within:bg-white focus-within:ring-primary/30 focus-within:shadow-[0_10px_30px_rgba(0,0,0,0.08)] lg:px-6 lg:py-3.5">
        <SearchIcon className="h-4.5 w-4.5 shrink-0 text-[#4D4D4D] transition-colors duration-300 group-focus-within/search:text-primary" />

        <input
          id={inputId}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="w-full flex-grow bg-transparent font-body text-[15px] text-[#000000] outline-none placeholder:text-[#797979] [&::-webkit-search-cancel-button]:appearance-none"
        />

        {hasQuery && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="shrink-0 rounded-full p-1 text-[#797979] transition-colors duration-200 hover:bg-black/5 hover:text-[#000000]"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {hasQuery && typeof resultCount === "number" && (
        <p className="font-body text-sm text-black/55">
          {resultCount}{" "}
          {resultCount === 1 ? resultNoun.singular : resultNoun.plural} found
          for
          <span className="text-[#000000]">&nbsp;&ldquo;{keyword}&rdquo;</span>
        </p>
      )}
    </div>
  );
};

export default SearchFilterInput;

const SearchIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M15.2769 15.2767L19.2375 19.2374"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const CloseIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
