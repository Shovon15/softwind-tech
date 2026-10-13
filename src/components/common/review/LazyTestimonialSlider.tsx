"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useNearViewport } from "@/hooks/useNearViewport";

// Swiper is ~100KB of JS and measures layout when it initialises, so loading
// it with the page cost ~800ms of main-thread time during hydration even
// though the reviews sit far down the page. `ssr: false` keeps it out of the
// initial HTML and chunks; it is only fetched once the section is near.
const TestimonialSlider = dynamic(() => import("./TestimonialSlider"), {
  ssr: false,
  loading: () => <SliderPlaceholder />,
});

// Roughly the slider's height (py-9 + a 290px card + pagination), so the page
// doesn't jump when the real slider replaces it.
const SliderPlaceholder = () => <div className="min-h-[400px]" aria-hidden />;

type Props = {
  data: IReview[];
};

export default function LazyTestimonialSlider({ data }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  // True once the section is within half a viewport of the screen, so the
  // slider is usually ready by the time it scrolls into view.
  const isNearViewport = useNearViewport(ref);

  return (
    <div ref={ref}>
      {isNearViewport ? <TestimonialSlider data={data} /> : <SliderPlaceholder />}
    </div>
  );
}
