import { cn } from "@/utils/helpers/cn";
import { ButtonHTMLAttributes, ReactNode } from "react";

export type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  icon?: ReactNode;
  prependIcon?: ReactNode;
  appendIcon?: ReactNode;
  loading?: boolean;
  /**
   * Render as a non-interactive <span> styled like the button. Use it when the
   * button sits inside a link (<NavLink><PrimaryButton as="span">): a <button>
   * inside an <a> is two nested focus targets - screen readers announce it
   * twice and Lighthouse fails it on touch-target size.
   */
  as?: "button" | "span";
};

const ButtonComponent = ({
  children,
  icon,
  prependIcon,
  appendIcon,
  loading = false,
  className,
  disabled,
  as = "button",
  ...props
}: BaseButtonProps) => {
  const isDisabled = disabled || loading;
  const Tag = as;
  const tagProps =
    as === "button"
      ? { disabled: isDisabled, ...props }
      : (({ type: _type, ...rest }) => rest)(props);

  return (
    <Tag
      className={cn(
        "focus:outline-none focus:ring-0 inline-flex items-center justify-center gap-[calc(8/1920*100vw)] px-[calc(16/1920*100vw)] py-[calc(8/1440*100vw)] rounded font-medium  disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.97] duration-100 transition-all",
        className,
      )}
      {...(tagProps as React.HTMLAttributes<HTMLElement>)}
    >
      {/* icon-only */}
      {icon && !children && icon}

      {/* prepend icon + text */}
      {prependIcon && (
        <span className="mr-[calc(4/1920*100vw)]">{prependIcon}</span>
      )}
      {children}
      {appendIcon && (
        <span className="ml-[calc(4/1920*100vw)]">{appendIcon}</span>
      )}
    </Tag>
  );
};

export default ButtonComponent;
