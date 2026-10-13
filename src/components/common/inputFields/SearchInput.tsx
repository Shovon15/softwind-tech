"use client";
import { cn } from "@/utils/helpers/cn";
import React from "react";
import "./style.css";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: () => void;
  placeholder?: string;
  iconOnly?: boolean;
  loading?: boolean;
};

const SearchInput = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search for a product...",
  iconOnly = false,
  loading = false,
}: Props) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-center w-full max-w-lg h-[40px] bg-[#F2F2F2] rounded-full p-[15px] lg:px-6 lg:py-2",
          !iconOnly && "w-full max-w-[251px] md:min-w-[317px]",
        )}
      >
        {!iconOnly && (
          <input
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-grow bg-transparent outline-none text-[16px] text-gray-700 placeholder-[#797979]"
          />
        )}

        <button
          onClick={onSubmit}
          type="button"
          aria-label="Search"
          className="text-gray-600 hover:text-black transition-colors"
        >
          <svg
            // width="20"
            // height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-[#4D4D4D]"
          >
            <path
              d="M15.2769 15.2767L19.2375 19.2374"
              stroke="#4D4D4D"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="9" cy="9" r="8" stroke="#4D4D4D" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
      {loading && (
        <div className="absolute left-0 top-10 h-6  px-6 w-[251px] md:min-w-[317px] flex items-center justify-between">
          <WevLoading />
        </div>
      )}
    </div>
  );
};

export default SearchInput;

export const WevLoading = () => {
  return (
    <div
      className="flex items-end gap-1"
      aria-live="polite"
      aria-label="Loading"
    >
      <span className="wave-dot size-2 rounded-full"></span>
      <span className="wave-dot size-2 rounded-full"></span>
      <span className="wave-dot size-2 rounded-full"></span>
    </div>
  );
};
