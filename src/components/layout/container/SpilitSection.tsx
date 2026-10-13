type SplitSectionProps = {
  left: React.ReactNode; // Content for the left side
  right: React.ReactNode; // Content for the right side
  reverse?: boolean; // Optional prop to reverse the order on large screens
  className?: string; // Optional additional classes for styling
};

const SplitSection = ({
  left,
  right,
  reverse = false, // controls which side shows where
  className = "",
}: SplitSectionProps) => {
  return (
    <div
      className={`
        flex flex-col lg:flex-row 
        ${reverse ? "lg:flex-row-reverse" : ""}
        items-center justify-between 
        gap-10 py-12 mt-3 lg:mt-12
        ${className}
      `}
    >
      {/* Left Content */}
      <div className="w-full lg:w-1/2">{left}</div>

      {/* Right Content */}
      <div className="w-full lg:w-1/2">{right}</div>
    </div>
  );
};

export default SplitSection;
