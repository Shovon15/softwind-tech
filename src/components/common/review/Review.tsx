import GoogleLogo from "@/assets/icons/GoogleLogo";
import ContentContainer from "@/components/layout/container/contentContainer";
import NavLink from "../link/NavLink";
import { HighlightHeading } from "../typography/HighlightHeading";
import StarRating from "./StarRating";
import LazyTestimonialSlider from "./LazyTestimonialSlider";
type Props = {
  data: IReviewBlock;
  className?: string;
};

const Review = ({ data, className = "" }: Props) => {
  const getAverageRating = (reviews: IReview[]): number => {
    if (!reviews.length) return 0;

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);

    return Number((total / reviews.length).toFixed(1));
  };
  const reviews = data?.data?.records ?? [];
  const averageRating = getAverageRating(reviews);
  return (
    <ContentContainer className={className}>
      <HighlightHeading
        text={data?.title}
        highlight={["reviews"]}
        highlightClassName="text-primary  "
        className="lg:max-w-[85vw] xl:max-w-[60vw] 2xl:max-w-[50vw] mx-auto text-center leading-[100%]"
      />
      {/* <MainTitle text1={mainTitle} text2={spanTitle} /> */}
      <div className="bg-[#F2F2F2]  p-6 flex flex-col lg:flex-row justify-between lg:items-center mt-10 lg:mt-16 gap-8">
        <div>
          <p className="font-body font-medium text-lg xl:text-2xl text-[#1A1A1A] flex justify-start items-center gap-2">
            <GoogleLogo className="w-[90px] xl:w-[122px]" />
            Rating
          </p>
          <div className="flex gap-2 justify-start items-center mt-2 xl:mt-4">
            <p className="font-body text-sm xl:text-base font-semibold text-[#1A1A1A]">
              {averageRating}
            </p>
            <StarRating
              initialValue={averageRating}
              readOnly
              sizeClass={"w-4 h-4 xl:w-6 xl:h-6"}
            />
            <p className="font-body font-normal text-xs text-[#6b6b6b]">
              {reviews?.length} reviews
            </p>
          </div>
        </div>
        {/* <div className="w-full lg:w-fit"> */}
        {/* <NavLink
            // href="https://maps.app.goo.gl/gmP6xGjPRP1tCUAx5"
            href="#"
            // target="_blank"
            rel="noopener noreferrer"
            className="block px-4 xl:px-7 py-3 xl:py-4 bg-[#E4002B] rounded-full font-body font-medium text-xs xl:text-base text-white uppercase border border-[#E4002B] hover:bg-transparent hover:text-[#E4002B] transition-all duration-300 text-center"
          >
            View Google reviews
          </NavLink> */}
        {/* </div> */}
      </div>
      <LazyTestimonialSlider data={reviews} />
    </ContentContainer>
  );
};

export default Review;
