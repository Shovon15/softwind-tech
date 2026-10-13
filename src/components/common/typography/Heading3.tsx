import { cn } from "@/utils/helpers/cn";
import React from "react";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

type HeadingTextProps = {
  children: React.ReactNode;
  tag?: HeadingTag;
  className?: string;
  [key: string]: any;
};

const Heading3 = ({
  children,
  tag = "h3",
  className,
  ...props
}: HeadingTextProps) => {
  const commonClasses =
    " font-boldCond font-[400] text-[clamp(20px,_calc(3.8779vw+3.3252px),_77.78px)] leading-[40px] text-[#FFFFFF] uppercase";

  return React.createElement(
    tag,
    {
      className: cn(commonClasses, className),
      ...props,
    },
    children,
  );
};

export default Heading3;
