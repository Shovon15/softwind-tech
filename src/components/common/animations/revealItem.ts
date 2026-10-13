const OFFSET = {
  up: (d: number) => `translate3d(0, ${-d}px, 0)`,
  down: (d: number) => `translate3d(0, ${d}px, 0)`,
  left: (d: number) => `translate3d(${-d}px, 0, 0)`,
  right: (d: number) => `translate3d(${d}px, 0, 0)`,
};

/**
 * Props for an element inside <Reveal> that should animate in. Kept out of
 * Reveal.tsx ("use client") so server components can call it.
 *
 * @param from side the element slides in from
 * @param delay transition delay in seconds
 * @param duration transition duration in seconds
 */
export const revealItem = (
  from: keyof typeof OFFSET = "down",
  distance = 120,
  delay = 0,
  duration = 1.2,
) => ({
  "data-reveal-item": "",
  style: {
    "--reveal-from": OFFSET[from](distance),
    "--reveal-delay": `${delay}s`,
    "--reveal-duration": `${duration}s`,
  } as React.CSSProperties,
});
