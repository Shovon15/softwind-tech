import { cn } from "@/utils/helpers/cn";
import React from "react";

const Spinner = ({ className = "" }) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-[#1a43bf] border-t-[#ffe138] size-[3vw] lg:size-[1.246vw]",
        className,
      )}
    />
  );
};

export default Spinner;
