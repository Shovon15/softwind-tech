"use client";

import { useState } from "react";

const TextareaComponent = ({
  label,
  name,
  required = false,
  className = "",
  inputTextColor = "text-[#000000]",
  extraClass = "",
  labelClassName = "text-[#ADADAD]",
  errorMessage = "",
  errorAnimationKey = 0,
  errorBackgroundClassName = "",
  value,
  onChange,
  ...rest
}: {
  label: string;
  name: string;
  [key: string]: any;
  className?: string;
  extraClass?: string;
  value?: string | number;
  errorMessage?: string;
  errorAnimationKey?: number;
  errorBackgroundClassName?: string;
  onChange?: (e: any) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue =
    value !== undefined &&
    value !== null &&
    value !== 0 &&
    String(value).trim() !== "";

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    rest.onBlur?.(e);
  };

  return (
    <div className={`relative z-0 w-full ${className}`}>
      <textarea
        {...rest}
        id={name}
        name={name}
        value={value}
        rows={2}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder=" "
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={errorMessage ? `${name}-error` : undefined}
        data-lenis-prevent
        className={`pt-3 pb-2 block w-full px-0 mt-0 border-0 border-b ${
          errorMessage ? "border-[#E4002B]" : "border-[#6C757D]"
        } ${
          errorMessage ? errorBackgroundClassName : ""
        } appearance-none focus:outline-none focus:ring-0 focus:border-[#E4002B] peer transition-colors duration-200 font-body font-normal lg:font-medium text-base ${inputTextColor}`}
      />
      <label
        htmlFor={name}
        className={`absolute origin-0 transition-all duration-300 pointer-events-none font-body overflow-hidden w-full truncate ${extraClass} ${
          isFocused || hasValue
            ? " -top-2 text-xs text-[#EE1F26] font-medium"
            : ` top-3 text-sm lg:text-base font-normal lg:font-medium ${labelClassName}`
        }`}
      >
        {label}{" "}
        <span
          className={`${required ? " " : "hidden"} text-[#EE1F26] text-base `}
        >
          *
        </span>
      </label>
      {errorMessage && (
        <p
          key={errorAnimationKey}
          id={`${name}-error`}
          role="alert"
          className="input-error-shake mt-1 font-body text-sm font-medium text-[#E4002B]"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default TextareaComponent;
