"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import type Lenis from "lenis";

// `useSearchParams()` opts its nearest Suspense boundary out of server
// rendering. Keeping it in this leaf — which renders nothing and sits behind
// its own boundary — confines that bailout here instead of dropping the whole
// app to client-side rendering.
function ScrollToTopOnRouteChange({ lenis }: { lenis: Lenis | null }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    requestAnimationFrame(() => {
      if (lenis) {
        lenis.scrollTo(0, {
          duration: 1.1,
          force: true,
        });
        return;
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }, [routeKey, lenis]);

  return null;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenis = useSmoothScroll();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <ScrollToTopOnRouteChange lenis={lenis} />
      </Suspense>
      {children}
    </>
  );
}
