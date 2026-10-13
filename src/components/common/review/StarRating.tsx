"use client";
import { useState, useEffect } from "react";

type StarRatingProps = {
  initialValue?: number;
  readOnly?: boolean;
  onChange?: (rating: number) => void;
  totalStars?: number;
  currentColor?: string;
  sizeClass?: string;
};

export default function StarRating({
  initialValue = 0,
  readOnly = false,
  onChange = () => {},
  totalStars = 5,
  currentColor = "#FFC107",
  sizeClass = "w-6 h-6",
}: StarRatingProps) {
  const [rating, setRating] = useState(initialValue);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    setRating(initialValue);
  }, [initialValue]);

  const getDisplayRating = () => hoverRating ?? rating;

  const handleClick = (value: number) => {
    if (readOnly) return;
    setRating(value);
    onChange(value);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (readOnly) return;

    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;

    const value = x < width / 2 ? index - 0.5 : index;
    setHoverRating(value);
  };

  const renderStar = (index: number) => {
    const displayRating = getDisplayRating();

    let fillPercent = 0;

    if (displayRating >= index) {
      fillPercent = 100;
    } else if (displayRating >= index - 1) {
      fillPercent = (displayRating - (index - 1)) * 100;
    }

    return (
      <div className={`relative ${sizeClass}`}>
        {/* Empty */}
        <svg
          className={`absolute ${sizeClass} text-gray-300`}
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.179 0.42041C10.2551 0.192935 10.5774 0.192931 10.6536 0.42041L12.8167 6.88037C12.9183 7.18376 13.2018 7.38921 13.5217 7.39209L20.3342 7.45361C20.5737 7.45615 20.6732 7.76207 20.4807 7.90479L15.0051 11.9585C14.748 12.1489 14.6395 12.4815 14.7356 12.7866L16.7825 19.2847C16.8545 19.5135 16.594 19.7022 16.3987 19.563L10.8518 15.6089C10.5913 15.4232 10.2412 15.4232 9.98071 15.6089L4.43384 19.563C4.2385 19.7022 3.97797 19.5135 4.05005 19.2847L6.09692 12.7866C6.19304 12.4815 6.08453 12.1489 5.82739 11.9585L0.351807 7.90479C0.159336 7.76208 0.258792 7.45615 0.498291 7.45361L7.31079 7.39209C7.63073 7.38921 7.91426 7.18376 8.01587 6.88037L10.179 0.42041Z"
            stroke="#FFC107"
            strokeWidth="0.5"
          />
        </svg>

        {/* Filled */}
        <div
          className="absolute top-0 left-0 h-full overflow-hidden"
          style={{ width: `${fillPercent}%` }}
        >
          <svg
            className={sizeClass}
            fill={currentColor}
            viewBox="0 0 21 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.94214 0.340975C10.0945 -0.11398 10.738 -0.113979 10.8904 0.340975L13.0539 6.80111C13.1216 7.00337 13.3102 7.14038 13.5235 7.1423L20.336 7.20365C20.8158 7.20797 21.0147 7.81997 20.6291 8.10547L15.1537 12.1594C14.9822 12.2863 14.9102 12.508 14.9743 12.7115L17.0211 19.2095C17.1653 19.6671 16.6447 20.0454 16.254 19.7669L10.7065 15.8122C10.5328 15.6884 10.2997 15.6884 10.126 15.8122L4.57852 19.7669C4.18784 20.0454 3.66724 19.6671 3.81138 19.2095L5.85823 12.7115C5.92231 12.508 5.85028 12.2863 5.67885 12.1594L0.203465 8.10547C-0.182139 7.81997 0.016715 7.20797 0.496486 7.20365L7.309 7.1423C7.52229 7.14038 7.71088 7.00337 7.77862 6.80111L9.94214 0.340975Z"
              fill="#FFC107"
            />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-start">
      <div className="flex">
        {[...Array(totalStars)].map((_, i) => {
          const index = i + 1;
          return (
            <div
              key={i}
              className={`cursor-${readOnly ? "default" : "pointer"}`}
              onClick={() => handleClick(hoverRating ?? index)}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => setHoverRating(null)}
            >
              {renderStar(index)}
            </div>
          );
        })}
      </div>

      {!readOnly && (
        <p className="text-sm text-gray-500 mt-1">
          Rating: {(hoverRating ?? rating).toFixed(1)} / {totalStars}
        </p>
      )}
    </div>
  );
}
