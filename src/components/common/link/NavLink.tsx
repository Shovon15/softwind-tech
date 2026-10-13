"use client";
import { cn } from "@/utils/helpers/cn";
import Link, { LinkProps } from "next/link";
import React from "react";

type NavLinkProps = LinkProps & {
  children: React.ReactNode;
  href: string;
  replace?: boolean;
  scroll?: boolean;
  query?: Record<string, string | number>;
  className?: string;
  ariaLabel?: string;
  onClick?: (e?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  disabled?: boolean;
  title?: string;
  hover?: boolean;
  [key: string]: any;
};

export default function NavLink({
  children,
  href,
  replace = false,
  scroll = true,
  query,
  onClick,
  className = "",
  hover = true,
  title,
  ariaLabel,
  disabled = false,
  ...props
}: NavLinkProps) {
  const absoluteHref = href.startsWith("/") ? href : `/${href}`;
  const isExternal = href.startsWith("http") || href.startsWith("//");

  const combinedClass = `${
    disabled
      ? "opacity-45 pointer-events-none"
      : hover
      ? " hover:text-header cursor-pointer"
      : "cursor-pointer"
  }`;

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel || title}
        title={title}
        onClick={onClick}
        className={cn(combinedClass, className)}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={{ pathname: absoluteHref, query }}
      replace={replace}
      scroll={scroll}
      className={cn(combinedClass, className)}
      aria-label={ariaLabel || title}
      title={title}
      onClick={onClick}
      {...props}
    >
      {children}
    </Link>
  );
}
