"use client";

import ChevronDownIcon from "@/assets/icons/ChevronDownIcon";
import { cn } from "@/utils/helpers/cn";
import { useState, useRef, useEffect, useId } from "react";

type Option = {
  label: string;
  value: string;
  slug?: string;
};

interface DropdownProps {
  options: Option[];
  placeholder?: string;
  value: string;
  onChange: (value: Option) => void;
  label?: string;
  className?: string;
  inputTextColor?: string;
  labelTextColor?: string;
  islabelActive?: boolean;
  showSearch?: boolean;
  required?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  errorAnimationKey?: number;
  errorBackgroundClassName?: string;
}

export function Dropdown({
  options,
  placeholder,
  value,
  onChange,
  label,
  className = "",
  inputTextColor = "text-[#000000]",
  labelTextColor = "text-[#ADADAD]",
  islabelActive = false,
  showSearch = false,
  required = false,
  disabled = false,
  errorMessage = "",
  errorAnimationKey = 0,
  errorBackgroundClassName = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const baseId = useId();
  const errorId = `${baseId}-error`;
  const buttonId = `${baseId}-button`;

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {label && (
        <label
          htmlFor={buttonId}
          className={`origin-0 transition-all duration-300 pointer-events-none font-body overflow-hidden w-full truncate  ${
            islabelActive
              ? isOpen
                ? "-top-4 text-xs text-[#EE1F26] font-normal"
                : "-top-4 text-sm lg:text-base text-[#151515] font-normal lg:font-medium"
              : isOpen || value
                ? "absolute -top-2 text-xs text-[#EE1F26] font-medium"
                : `absolute top-3 text-sm lg:text-base font-normal lg:font-medium ${labelTextColor}`
          }`}
        >
          {label}{" "}
          <span
            className={`${required ? "" : "hidden"} text-[#EE1F26] text-base`}
          >
            *
          </span>
        </label>
      )}

      <button
        type="button"
        id={buttonId}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-label={!label && !placeholder ? "Select an option" : undefined}
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={errorMessage ? errorId : undefined}
        onClick={() => {
          if (disabled) return;
          setIsOpen((prev) => !prev);
        }}
        className={cn(
          "pt-3 pb-2 w-full px-0 mt-0 border-0 border-b appearance-none focus:outline-none focus:ring-0 focus:border-[#E4002B] peer transition-colors duration-200 font-body font-normal lg:font-medium text-sm lg:text-base text-black flex items-center justify-between",
          errorMessage
            ? ["border-[#E4002B]", errorBackgroundClassName]
            : "border-[#6C757D] bg-transparent",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span
          className={isOpen || value ? `${inputTextColor}` : "text-gray-500"}
        >
          {selectedLabel || placeholder}
        </span>

        <ChevronDownIcon
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {errorMessage && (
        <p
          key={errorAnimationKey}
          id={errorId}
          role="alert"
          className="input-error-shake mt-1 font-body text-sm font-medium text-[#E4002B]"
        >
          {errorMessage}
        </p>
      )}

      {isOpen && !disabled && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-[260px] overflow-y-auto overscroll-contain z-20"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {showSearch && (
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#E4002B]"
              />
            </div>
          )}

          <div className="max-h-[200px] overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={cn(
                    `w-full text-left px-4 py-3 hover:bg-gray-100 focus:outline-none border-b border-gray-200 last:border-b-0 text-gray-900 `,
                    selectedLabel === option.label ? "bg-gray-100" : "",
                  )}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
