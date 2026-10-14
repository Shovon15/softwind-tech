import { cn } from "@/utils/helpers/cn";
import React, { forwardRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  disablePX?: boolean;
  disablePR?: boolean;
  disablePL?: boolean;
  disablePLOnLg?: boolean;
};

const ContentContainer = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      className = "",
      disablePX,
      disablePR,
      disablePL,
      disablePLOnLg,
    },
    ref,
  ) => {
    const padding = ` ${disablePX ? "!px-0" : ""} ${
      disablePL ? "!pl-0" : ""
    } ${disablePR ? "!pr-0" : ""} ${disablePLOnLg ? "lg:!pl-0" : ""}`;

    return (
      <div
        ref={ref}
        className={cn(
          "px-4 md:px-[7vw] 2xl:px-[9vw] h-full",
          padding,
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

ContentContainer.displayName = "ContentContainer";

export default ContentContainer;
