import { cn } from "@/utils/helpers/cn";
import React from "react";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

type HeadingTextProps = {
  children: React.ReactNode;
  tag?: HeadingTag;
  className?: string;
  [key: string]: any;
};

const Heading2 = ({
  children,
  tag = "h2",
  className,
  ...props
}: HeadingTextProps) => {
  const commonClasses =
    "font-boldCond font-[400] text-[clamp(32px,_calc(7.055vw+1.6634px),_137.12px)] leading-[24px] lg:leading-[90px] text-[#FF2E17] uppercase";

  return React.createElement(
    tag,
    {
      className: cn(commonClasses, className),
      ...props,
    },
    children,
  );
};

export default Heading2;
