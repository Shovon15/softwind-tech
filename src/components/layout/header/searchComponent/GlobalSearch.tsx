import React from "react";

type Props = {
  isSearchItemOpen: boolean;
  setIsSearchItemOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const GlobalSearch = ({ setIsSearchItemOpen, isSearchItemOpen }: Props) => {
  return (
    <div
      onClick={() => {
        setIsSearchItemOpen(true);
      }}
      className="border border-white w-[34px] md:w-[108px] h-[34px] rounded-full flex items-center justify-end cursor-pointer relative"
    >
      <button
        type="button"
        aria-label="Search"
        className="absolute right-[-1px] md:right-[-2px] top-1/2 -translate-y-1/2 bg-[#FFFFFF] size-[34px] rounded-full flex items-center justify-center cursor-pointer"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.4167 15.4167L17.5 17.5"
            stroke="#FF2E17"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle
            cx="9.21075"
            cy="9.21074"
            r="6.79408"
            stroke="#FF2E17"
            strokeWidth="1.5"
          />
        </svg>
      </button>
    </div>
  );
};

export default GlobalSearch;
