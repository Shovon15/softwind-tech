import React, { ReactNode } from "react";
import { cn } from "@/utils/helpers/cn";
import ButtonComponent, { BaseButtonProps } from ".";

type Props = BaseButtonProps & {
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
};

const IconButton = ({
  className,
  icon,
  iconPosition = "left",
  children,
  ...props
}: Props) => {
  return (
    <div className="inline-flex h-full p-[1px]">
      <ButtonComponent
        {...props}
        className={cn(
          "flex items-center justify-center gap-2",
          "bg-primary text-white capitalize rounded-full",
          "h-full aspect-square",
          "text-[3.5vw] md:text-[1.5vw] lg:text-[0.99vw]",
          "transition font-dmSans",
          className,
        )}
      >
        {icon && iconPosition === "left" && (
          <span className="flex items-center">{icon}</span>
        )}

        {children}

        {icon && iconPosition === "right" && (
          <span className="flex items-center">{icon}</span>
        )}
      </ButtonComponent>
    </div>
  );
};

export default IconButton;
