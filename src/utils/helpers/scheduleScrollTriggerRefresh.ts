import { ScrollTrigger } from "gsap/ScrollTrigger";

let timer: ReturnType<typeof setTimeout> | undefined;

/**
 * Coalesces ScrollTrigger.refresh() calls. Every refresh re-measures all
 * triggers on the page (forced layout), so when each animated heading asks for
 * its own refresh on mount, hydration pays for N full layouts. Calls made
 * within `delay` ms of each other collapse into a single refresh.
 */
export function scheduleScrollTriggerRefresh(delay = 100) {
  if (typeof window === "undefined") return;

  clearTimeout(timer);
  timer = setTimeout(() => {
    timer = undefined;
    ScrollTrigger.refresh();
  }, delay);
}
