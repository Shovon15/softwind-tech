import React from "react";
import { cn } from "@/utils/helpers/cn";
import ButtonComponent, { BaseButtonProps } from ".";

type Props = BaseButtonProps & {
  className?: string;
  innerClassName?: string;
};

const PrimaryButton = ({
  className = "max-h-[60px]",
  innerClassName,
  ...props
}: Props) => {
  return (
    <div className={cn("inline-flex h-full p-[1px]", className)}>
      <ButtonComponent
        {...props}
        className={cn(
          "bg-primary text-white capitalize rounded-full",
          "w-full h-full",
          "px-4 py-3 md:px-5 xl:px-8",
          "text-[3.5vw] md:text-[1.5vw] lg:text-[0.99vw]",
          "transition font-body flex items-center justify-center",
          innerClassName,
        )}
      />
    </div>
  );
};

export default PrimaryButton;
