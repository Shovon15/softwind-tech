type ScrollOptions = {
  /** Negative values stop above the target, leaving room for the sticky header. */
  offset?: number;
  duration?: number;
  onComplete?: () => void;
};

/**
 * Scrolls to an element through Lenis when it is running, falling back to the
 * native smooth scroll otherwise.
 */
export const smoothScrollTo = (
  target: HTMLElement | null,
  { offset = -100, duration = 1.1, onComplete }: ScrollOptions = {},
) => {
  if (!target || typeof window === "undefined") return;

  const lenis = (window as any).__lenis;

  if (lenis) {
    lenis.scrollTo(target, { offset, duration, force: true, onComplete });
    return;
  }

  window.scrollTo({
    top: target.getBoundingClientRect().top + window.scrollY + offset,
    behavior: "smooth",
  });

  if (onComplete) window.setTimeout(onComplete, duration * 1000);
};

export default smoothScrollTo;
