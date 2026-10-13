"use client";

import Link from "next/link";
import React from "react";
import { cn } from "@/utils/helpers/cn";

type LoadMoreProps = {
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  loading?: boolean;
  showIcon?: boolean;
  label?: string;
};

const BORDER_BG = "linear-gradient(115deg, #FF2E17 60%, #1D0300 100%)";

const LoadMoreButton = ({
  icon, // kept for API compatibility (not shown in this big version)
  onClick,
  href,
  className = "",
  showIcon = true, // kept for API compatibility
  loading = false,
  label = "LOAD MORE",
}: LoadMoreProps) => {
  const inner = (
    <div
      className={cn(
        "p-[1px]", // border thickness
        className,
      )}
      style={{ background: BORDER_BG }}
    >
      <div
        className={cn(
          "w-full bg-[#0C0C0C] flex items-center justify-center font-dmSans font-[700]",
          "h-[60px] cursor-pointer",
          "select-none",
        )}
      >
        {loading ? (
          <div className="flex items-center gap-3 text-[#FF2E17]">
            <Spinner size={20} />
            <span className="uppercase  text-[clamp(14px,_calc(0.2772vw+12.8081px),_18.13px)]">
              Loading...
            </span>
          </div>
        ) : (
          <span className="uppercase text-[#FF2E17] text-[clamp(14px,_calc(0.2772vw+12.8081px),_18.13px)] tracking-[1px]">
            {label}
          </span>
        )}
      </div>
    </div>
  );

  // Link version
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "block active:scale-[0.99] transition-transform duration-150",
          loading && "pointer-events-none opacity-70",
        )}
        aria-disabled={loading}
      >
        {inner}
      </Link>
    );
  }

  // Button version
  return (
    <button
      onClick={onClick}
      type="button"
      disabled={loading}
      className="block w-full mx-auto max-w-[239px] p-[1px] active:scale-[0.99] transition-transform duration-150 disabled:opacity-70"
    >
      {inner}
    </button>
  );
};

export default LoadMoreButton;

const ArrowIcon = () => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.25 11C0.250001 5.06294 5.06294 0.25 11 0.25C16.9371 0.250001 21.75 5.06294 21.75 11C21.75 16.9371 16.9371 21.75 11 21.75C5.06294 21.75 0.25 16.9371 0.25 11ZM7.08203 9.19727C6.76754 9.46683 6.73141 9.94039 7.00098 10.2549L9.66992 13.3691C10.3683 14.1837 11.6287 14.1837 12.3271 13.3691L14.9971 10.2549C15.2665 9.94039 15.2295 9.4668 14.915 9.19727C14.6005 8.92776 14.127 8.96385 13.8574 9.27832L11.1885 12.3926C11.0887 12.509 10.9084 12.509 10.8086 12.3926L8.13965 9.27832C7.87008 8.96384 7.39652 8.92771 7.08203 9.19727Z"
        fill="#2F2F2F"
      />
    </svg>
  );
};

export const Spinner = ({
  className,
  size = 48,
}: {
  className?: string;
  size?: number;
}) => {
  return (
    <span
      className={cn("loader", className)}
      style={{
        width: size,
        height: size,
      }}
    />
  );
};
