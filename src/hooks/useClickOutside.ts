import { useEffect } from "react";

type EventType = MouseEvent | TouchEvent;

/**
 * Detects clicks or taps outside of a referenced element.
 *
 * @param ref - React ref of the target element
 * @param handler - Function to call when an outside click occurs
 * @param enabled - Optional flag to enable/disable the listener
 */
export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<HTMLElement | null>,
  handler: (event: EventType) => void,
  enabled: boolean = true,
) => {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: EventType) => {
      const el = ref?.current;
      if (!el || el.contains(event.target as Node)) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
};
