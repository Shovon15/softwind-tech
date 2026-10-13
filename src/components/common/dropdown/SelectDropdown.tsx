import { cn } from "@/utils/helpers/cn";
import React, { useEffect, useRef, useState } from "react";

export type SelectDropdownOption = {
  label: string;
  value: string;
  raw?: any;
};
type SelectDropdownProps = {
  label?: string | React.ReactNode;
  placeholder?: string;
  options: SelectDropdownOption[];
  selected: SelectDropdownOption | null;
  onChange: (selected: SelectDropdownOption | null) => void;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  widthClass?: string;
};

const SelectDropdown = ({
  label,
  placeholder = "",
  options,
  selected,
  onChange,
  className = "",
  buttonClassName = "",
  dropdownClassName = "",
  widthClass = "",
}: SelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: SelectDropdownOption) => {
    onChange(option);
    setIsOpen(false);
  };

  const selectedLabel = selected ? selected.label : placeholder;
  const widthClassName = widthClass || "w-[164px] md:min-w-[280px]";

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      {label && (
        <span className=" font-normal text-base leading-[22px] tracking-[0] text-[#FFFFFF] py-3 inline-block">
          {label}
        </span>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex items-center justify-between h-[50px] text-sm px-5 font-normal text-[#F73219] font-poppins relative border border-[#F73219] rounded-full bg-transparent",
          widthClassName,
          buttonClassName,
        )}
      >
        <span className="truncate w-full text-left text-[16px] leading-[22px] font-[400] md:pl-2 ">
          {selectedLabel}
        </span>
        <span
          className={cn(
            "transition-transform duration-300",
            isOpen ? "rotate-180" : "rotate-0",
          )}
        >
          <ArrowDownIcon />
        </span>
      </button>

      <div
        className={cn(
          "transition-all mt-[-1px] duration-300 origin-top-left absolute z-20 bg-[#0000007D] border border-[#F73219] rounded-[21px] shadow-lg max-h-[200px] overflow-auto",
          isOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none",
          widthClassName,
          dropdownClassName,
        )}
      >
        <ul>
          {options.map((option) => {
            const isSelected = selected?.value === option.value;
            return (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={cn(
                  "px-4 py-2 cursor-pointer hover:bg-[#f733193d] flex items-center justify-between font-medium",
                  isSelected
                    ? "bg-[#f733193d]  text-[#F73219]"
                    : "text-[#ffffff]",
                )}
              >
                <span>{option.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SelectDropdown;
const ArrowDownIcon = () => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 9.47345L10.5481 15.3298C11.3369 16.1625 12.663 16.1625 13.4519 15.3298L19 9.47345"
        stroke="#F73219"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
