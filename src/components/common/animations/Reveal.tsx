"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  /** Keep items visible after the first reveal instead of hiding them again when scrolled back above. */
  once?: boolean;
  className?: string;
};

/**
 * Lightweight scroll reveal (IntersectionObserver + CSS transitions) used in
 * place of GSAP ScrollTrigger for simple fade/slide-ins. When this container
 * reaches 75% of the viewport (ScrollTrigger `start: "top 75%"`), every
 * descendant spread with `revealItem()` (./revealItem) animates in. Styles: globals.css.
 */
const Reveal = ({ children, once = false, className }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (entry.boundingClientRect.top > 0) {
          // Only reset when back below the viewport (toggleActions
          // "play none none reverse"), not when scrolled past.
          setVisible(false);
        }
      },
      { rootMargin: "0px 0px -25% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      data-reveal=""
      data-visible={visible || undefined}
      className={className}
    >
      {children}
    </div>
  );
};

export default Reveal;
