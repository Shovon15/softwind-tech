import { cn } from "@/utils/helpers/cn";
import React from "react";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

type HeadingTextProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  tag?: HeadingTag;
  className?: string;

  // ✅ pass any JSX to render under the heading
  bottom?: React.ReactNode;

  // optional wrapper class if you need alignment/width control
  wrapperClassName?: string;
};

const  Heading1 = ({
  children,
  tag = "h1",
  className,
  bottom,
  wrapperClassName,
  ...props
}: HeadingTextProps) => {
  const Comp = tag;

  const commonClasses =
    "font-boldCond text-white py-3 text-[clamp(2.25rem,5vw,3.70rem)] leading-[clamp(2.5rem,6vw,4.375rem)]";

  return (
    <div className={cn("w-full", wrapperClassName)}>
      <div className="w-fit">
        <Comp className={cn(commonClasses, className)} {...props}>
          {children}
        </Comp>

        {bottom ? <div className="w-full">{bottom}</div> : null}
      </div>
    </div>
  );
};

export default Heading1;
