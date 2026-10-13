const ArrowIcon = ({
  direction = "left",
  className,
  strokeColor = "#667085",
}: {
  direction?: "left" | "right";
  className?: string;
  strokeColor?: string;
}) => {
  const rotationClass = direction === "left" ? "" : "rotate-180";
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${rotationClass} ${className}`}
    >
      <path
        d="M12.5026 6.66829H0.835938M0.835938 6.66829L6.66927 12.5016M0.835938 6.66829L6.66927 0.834961"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowIcon;
