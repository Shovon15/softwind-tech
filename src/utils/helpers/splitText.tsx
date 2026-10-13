const SplitText = (text: string, className: string) =>
  text?.split("").map((char: string, i: number) => (
    <span key={i} className={`text-primary ${className} inline-block`}>
      {char === " " ? "\u00A0" : char}
    </span>
  ));

export default SplitText;
