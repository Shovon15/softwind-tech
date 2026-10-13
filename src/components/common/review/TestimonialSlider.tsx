"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  EffectCoverflow,
  Autoplay,
} from "swiper/modules";
import gsap from "gsap";

import ImageComponent from "../image";
import { getTimeAgo } from "@/utils/helpers/getTimeAgo";
import SliderArrowIcon from "@/assets/icons/SliderArrowIcon";
import StarRating from "./StarRating";
import GoogleFavicon from "@/assets/icons/GoogleFavicon";

type props = {
  data: IReview[];
};

const REVIEW_CHARACTER_LIMIT = 150;

export default function TestimonialSlider({ data }: props) {
  const [expandedReviewIndexes, setExpandedReviewIndexes] = useState<number[]>(
    [],
  );

  const toggleExpandedReview = (index: number) => {
    setExpandedReviewIndexes((currentIndexes) =>
      currentIndexes.includes(index)
        ? currentIndexes.filter((currentIndex) => currentIndex !== index)
        : [...currentIndexes, index],
    );
  };

  // If there are 10 or fewer reviews, duplicate them so the loop has more than
  // 10 slides (otherwise loop mode can render blank space).
  const MIN_SLIDES = 10;
  const slides =
    data.length === 0 || data.length > 9
      ? data
      : Array.from({ length: MIN_SLIDES }, (_, i) => data[i % data.length]);

  return (
    <div className=" py-9">
      <div className="relative custom-pagination">
        <Swiper
          className="[&_.swiper-wrapper]:items-start"
          modules={[Navigation, EffectCoverflow, Pagination, Autoplay]}
          effect="coverflow"
          centeredSlides
          loop
          loopPreventsSliding={false}
          // pagination={{
          //   el: ".testimonial-pagination",
          //   clickable: true,
          // }}
          slidesPerView="auto"
          spaceBetween={20}
          speed={1200}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          touchRatio={1}
          resistanceRatio={0.85}
          navigation={{
            nextEl: ".next-btn",
            prevEl: ".prev-btn",
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 0,
            slideShadows: false,
          }}
          pagination={{
            el: ".testimonial-pagination",
            clickable: true,
            bulletClass: "testimonial-pagination-bullet",
            bulletActiveClass: "testimonial-pagination-bullet-active",
          }}
        >
          {slides.map((item: IReview, i) => {
            const review = item.review || "";
            const isLongReview = review.length > REVIEW_CHARACTER_LIMIT;
            const isExpanded = expandedReviewIndexes.includes(i);
            const reviewText =
              isLongReview && !isExpanded
                ? `${review.slice(0, REVIEW_CHARACTER_LIMIT).trim()}...`
                : review;

            return (
              <SwiperSlide
                key={i}
                className="max-w-[75%] md:max-w-[45%] lg:max-w-[32%] xl:max-w-[19.27vw]"
              >
                <TestimonialCard
                  item={item}
                  isExpanded={isExpanded}
                  isLongReview={isLongReview}
                  reviewText={reviewText}
                  onToggle={() => toggleExpandedReview(i)}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Navigation Buttons */}
        <div className="bg-[linear-gradient(270deg,rgba(255,255,255,0)_0%,#ffffff_100%)] absolute -left-0.5 lg:-left-1.5 h-full top-0  z-10 w-[6%] flex justify-start items-center  ">
          <button type="button" aria-label="Previous review" className="prev-btn  bg-white shadow rounded-full w-10 h-10 hidden lg:flex items-center justify-center p-3 text-[#E4002B] border border-[#E4002B] hover:bg-[#E4002B] hover:text-white ">
            <SliderArrowIcon />
          </button>
        </div>
        <div className="bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,#ffffff_100%)] absolute -right-0.5 lg:-right-1.5 h-full top-0  z-10 w-[6%] flex justify-end items-center  ">
          <button type="button" aria-label="Next review" className="next-btn bg-white shadow rounded-full w-10 h-10  hidden lg:flex items-center justify-center p-3 text-[#E4002B] border border-[#E4002B] hover:bg-[#E4002B] hover:text-white">
            <SliderArrowIcon className="rotate-180" />
          </button>
        </div>
      </div>

      {/* Pagination */}
      <div className="testimonial-pagination mt-6 flex justify-center items-center gap-2" />
    </div>
  );
}

type TestimonialCardProps = {
  item: IReview;
  isExpanded: boolean;
  isLongReview: boolean;
  reviewText: string;
  onToggle: () => void;
};

function TestimonialCard({
  item,
  isExpanded,
  isLongReview,
  reviewText,
  onToggle,
}: TestimonialCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const previousHeightRef = useRef<number | null>(null);
  const hasMountedRef = useRef(false);

  useLayoutEffect(() => {
    const card = cardRef.current;

    if (!card) return;

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const previousHeight = previousHeightRef.current ?? card.offsetHeight;

    gsap.killTweensOf(card);
    gsap.fromTo(
      card,
      { height: previousHeight, overflow: "hidden" },
      {
        height: "auto",
        duration: 0.35,
        ease: "power2.out",
        clearProps: "height,overflow",
      },
    );

    previousHeightRef.current = null;
  }, [isExpanded, reviewText]);

  const handleToggle = () => {
    previousHeightRef.current = cardRef.current?.offsetHeight ?? null;
    onToggle();
  };

  return (
    <div
      ref={cardRef}
      className="bg-[#F2F2F2] rounded-2xl p-5 shadow-sm min-h-[290px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 gap-4 w-full">
        <div className="flex justify-start items-start gap-4 flex-1 ">
          <div className="w-10 h-10 rounded-full ">
            <ImageComponent
              src={item?.avatar || "/user-img.jpg"}
              alt="user"
              width={1000}
              height={1000}
              className="rounded-full"
            />
          </div>

          <div className="flex-1 w-[50]">
            <h3 className="font-semibold font-body text-[#1A1A1A] text-sm xl:text-base truncate ">
              {item.name}
            </h3>
            <p className="text-xs text-[#6b6b6b] font-body font-normal mt-1">
              {getTimeAgo(item.reviewed_at)}
            </p>
          </div>
        </div>
        <div className="">
          <GoogleFavicon className="w-6 h-6 " />
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-1 my-4">
        <StarRating initialValue={item.rating} readOnly sizeClass="w-4 h-4 xl:w-6 xl:h-6" />
      </div>

      {/* Text */}
      <p className="text-xs xl:text-sm lg:text-[clamp(14px,0.833vw,16px)] font-body font-normal text-[#1A1A1A] ">
        {reviewText}
      </p>

      {/* Read more */}
      {isLongReview && (
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={handleToggle}
          className="text-[#DD002A] text-sm xl:text-base mt-0 font-[400] font-body uppercase underline mt-1"
        >
          {isExpanded ? "READ LESS" : "READ MORE"}
        </button>
      )}
    </div>
  );
}
