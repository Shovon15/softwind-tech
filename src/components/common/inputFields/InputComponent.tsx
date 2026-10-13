"use client";

import { useState } from "react";

const InputComponent = ({
  label,
  name,
  type = "text",
  className = "",
  extraClass = "",
  inputTextColor = "text-[#000000]",
  value,
  placeholder = " ",
  islabelActive = false,
  required = false,
  labelClassName = "text-[#ADADAD]",
  errorMessage = "",
  errorAnimationKey = 0,
  errorBackgroundClassName = "",
  onChange,
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  [key: string]: any;
  className?: string;
  extraClass?: string;
  value?: string | number;
  required?: boolean;
  errorMessage?: string;
  errorAnimationKey?: number;
  errorBackgroundClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue =
    value !== undefined &&
    value !== null &&
    value !== 0 &&
    String(value).trim() !== "";

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    rest.onBlur?.(e);
  };

  const displayedErrorMessage = errorMessage;

  return (
    <div className={`relative z-0 w-full ${className}`}>
      <label
        htmlFor={name}
        className={` origin-0 transition-all duration-300 pointer-events-none  font-body overflow-hidden w-full truncate ${extraClass} ${
          islabelActive
            ? isFocused
              ? " -top-4 text-xs text-[#EE1F26] font-normal"
              : " -top-4 text-sm lg:text-base text-[#151515] font-normal lg:font-medium"
            : isFocused || hasValue
              ? " absolute -top-2 text-xs text-[#EE1F26] font-medium"
              : ` absolute top-3 text-sm lg:text-base  font-normal lg:font-medium ${labelClassName}`
        }`}
      >
        {label}{" "}
        <span
          className={`${required ? " " : "hidden"} text-[#EE1F26] text-base `}
        >
          *
        </span>
      </label>
      <input
        {...rest}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        id={name}
        type={type}
        value={value}
        name={name}
        placeholder={placeholder}
        aria-invalid={Boolean(displayedErrorMessage)}
        aria-describedby={displayedErrorMessage ? `${name}-error` : undefined}
        // required={required}
        className={`pt-3 pb-2 block w-full px-0 mt-0 border-0 border-b ${
          displayedErrorMessage ? "border-[#E4002B]" : "border-[#6C757D]"
        } ${
          displayedErrorMessage ? errorBackgroundClassName : ""
        } appearance-none focus:outline-none focus:ring-0 focus:border-[#E4002B] peer transition-colors duration-200 font-body font-normal lg:font-medium text-base ${inputTextColor} ${islabelActive ? (isFocused || hasValue ? "text-[#000000]" : "text-[#767676]") : ""}`}
      />
      {displayedErrorMessage && (
        <p
          key={errorAnimationKey}
          id={`${name}-error`}
          role="alert"
          className="input-error-shake mt-1 font-body text-sm font-medium text-[#E4002B]"
        >
          {displayedErrorMessage}
        </p>
      )}
    </div>
  );
};

export default InputComponent;
