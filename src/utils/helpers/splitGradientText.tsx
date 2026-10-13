const SplitGradientText = (text: string) =>
  text?.split("").map((char: string, i: number) => (
    <span
      key={i}
      className="subtitle-letter inline-block"
      style={{
        background:
          // "linear-gradient(296.02deg, rgba(255,103,29,0) -0.62%, #FF671D 44.36%)",
          "white",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

export default SplitGradientText;
