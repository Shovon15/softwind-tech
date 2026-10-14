import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
// import Lenis from "@studio-freight/lenis";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export const useSmoothScroll = () => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenisInstance = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 1.5,
    });

    (window as any).__lenis = lenisInstance;
    setLenis(lenisInstance);

    // Sync Lenis with GSAP ScrollTrigger
    lenisInstance.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenisInstance.raf(time * 1000);
    };
    gsap.ticker.add(onTick);

    gsap.ticker.lagSmoothing(0);

    // Smooth scroll to anchor links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]');

      if (link) {
        e.preventDefault();
        const href = link.getAttribute("href");

        if (href && href !== "#") {
          const targetElement = document.querySelector(href) as HTMLElement;
          if (targetElement) {
            lenisInstance.scrollTo(targetElement, {
              offset: -80,
              duration: 1.8,
            });
          }
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      if ((window as any).__lenis === lenisInstance) {
        delete (window as any).__lenis;
      }
      lenisInstance.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(onTick);
      lenisInstance.destroy();
    };
  }, []);

  return lenis;
};
