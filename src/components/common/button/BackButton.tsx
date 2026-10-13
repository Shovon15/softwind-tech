"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/helpers/cn";

type BackButtonProps = {
  onClick?: () => void;
  href?: string;
  className?: string;
  loading?: boolean;
  label?: string;
};

const BORDER_BG = "linear-gradient(115deg, #FF2E17 60%, #1D0300 100%)";

const BackButton = ({
  onClick = () => {},
  href,
  className = "",
  loading = false,
  label = "BACK",
}: BackButtonProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (loading) return;
    if (onClick) return onClick();
    router.back();
  };

  const inner = (
    <div
      className={cn("mr-auto w-full max-w-[90px] p-[1px]", className)}
      //   style={{ background: BORDER_BG }}
    >
      <div
        className={cn(
          "w-full bg-none flex items-center justify-start gap-0 font-dmSans font-[700]",
          "h-[50px] select-none",
          loading ? "cursor-not-allowed opacity-70" : "cursor-pointer",
        )}
      >
        <ArrowLeftIcon className="shrink-0" />
        <span className="uppercase text-[#FF2E17] text-[clamp(14px,_calc(0.2772vw+12.8081px),_16.13px)] tracking-[1px]">
          {/* {loading ? "Loading..." : label} */}
          {label}
        </span>
      </div>
    </div>
  );

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

  return (
    <button
      onClick={handleBack}
      type="button"
      disabled={loading}
      className="inline-block active:scale-[0.99] transition-transform duration-150 disabled:opacity-70"
    >
      {inner}
    </button>
  );
};

export default BackButton;

const ArrowLeftIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={cn("w-5 h-5", className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M15 18L9 12L15 6"
      stroke="#FF2E17"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
