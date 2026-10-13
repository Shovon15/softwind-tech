import { RefObject, useEffect, useState } from "react";

/**
 * Becomes (and stays) true once `ref` is within `rootMargin` of the viewport.
 * Used to postpone expensive setup (e.g. GSAP SplitText, which forces layout)
 * until an element is about to scroll into view, instead of doing it for every
 * element during hydration.
 */
export function useNearViewport(
  ref: RefObject<Element | null>,
  enabled = true,
  rootMargin = "0px 0px 50% 0px",
) {
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || isNear || !el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, enabled, isNear, rootMargin]);

  return isNear;
}
