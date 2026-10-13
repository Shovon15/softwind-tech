import ScrollReveal from "@/components/common/animations/ScrollReveal";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import ImageComponent from "@/components/common/image";
import NavLink from "@/components/common/link/NavLink";
import { HighlightHeading } from "@/components/common/typography/HighlightHeading";
import Paragraph from "@/components/common/typography/Paragraph";

import ContentContainer from "@/components/layout/container/contentContainer";
import routes from "@/config/routes";
import { cn } from "@/utils/helpers/cn";
import decodeHtmlEntities from "@/utils/helpers/decodeHtmlEntities";
import Image, { StaticImageData } from "next/image";
import { memo } from "react";
type Props = {
  bgImage?: string | StaticImageData;
  title?: string;
  highlighted?: string[];
  description?: string;
  mainTextColor?: string;
  spanTextColor?: string;
  highlightClassName?: string;
  contentClassName?: string;
  ctaButton?: boolean;
  ctaButtonClassName?: string;
  ctaButtonInnerClassName?: string;
  /** Optional query string appended to the CTA link. */
  query?: Record<string, string | number>;
};

const PageBanner = ({
  bgImage,
  title = "",
  highlighted,
  description = "",
  mainTextColor = "text-white",
  spanTextColor = "text-primary",
  highlightClassName = "text-primary",
  contentClassName = "",
  ctaButton = false,
  ctaButtonClassName = "",
  ctaButtonInnerClassName = "",
  query,
}: Props) => {
  return (
    <div className="relative w-full min-h-[368px] lg:min-h-[476px] h-auto overflow-hidden flex justify-center items-end pb-6">
      <ImageComponent
        src={bgImage}
        alt="Banner image"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-[linear-gradient(270deg,rgba(30,30,30,0)_0%,#00000099_70.82%)] z-10" />

      {/* 🧊 Content on top */}
      <ContentContainer
        className={cn(
          "relative z-20 h-full flex flex-col justify-end pt-24 md:pt-28 pb-10 lg:pt-[190px] lg:pb-20 md:px-[7vw] w-full",
          contentClassName,
        )}
      >
        <ScrollReveal className="md:max-w-4xl text-white space-y-5">
          <HighlightHeading
            text={title}
            highlight={highlighted}
            highlightClassName={highlightClassName}
            className="leading-[100%] text-white"
            tag="h1"
          />

          <div
            className={cn(
              "font-dmSans font-[300] text-white py-0 text-[clamp(14px,1.2vw,16px)] leading-[clamp(20px,1.6vw,26px)] ",
            )}
            dangerouslySetInnerHTML={{
              __html: decodeHtmlEntities(description),
            }}
          />

          {ctaButton && (
            <NavLink
              href={routes.contact}
              query={query}
              className={cn(`block w-full text-center`, ctaButtonClassName)}
            >
              <PrimaryButton
                as="span"
                className={cn(
                  "block w-full lg:inline-block lg:w-auto",
                  ctaButtonInnerClassName,
                )}
              >
                Get in Touch
              </PrimaryButton>
            </NavLink>
          )}

          {/* <Paragraph
            className="lg:max-w-[75%] font-normal text-white text-sm lg:text-base leading-relaxed mt-4 font-body !text-[clamp(14px,1.1vw,16px)] text-justify"
            content={description}
          /> */}

          {/* <p className="lg:max-w-[75%] font-normal text-white text-sm lg:text-base leading-relaxed mt-4">
            {description}
          </p> */}
        </ScrollReveal>
      </ContentContainer>
      <ShapeSm className="absolute bottom-0 left-0 z-20 md:hidden" />
      <Shape className="absolute bottom-0 left-0 z-20 hidden md:block" />
    </div>
  );
};

const areHighlightsEqual = (left?: string[], right?: string[]) => {
  if (left === right) return true;
  if (!left || !right || left.length !== right.length) return false;

  return left.every((item, index) => item === right[index]);
};

export default memo(PageBanner, (prev, next) => {
  return (
    prev.bgImage === next.bgImage &&
    prev.title === next.title &&
    prev.description === next.description &&
    prev.mainTextColor === next.mainTextColor &&
    prev.spanTextColor === next.spanTextColor &&
    prev.highlightClassName === next.highlightClassName &&
    prev.contentClassName === next.contentClassName &&
    prev.ctaButton === next.ctaButton &&
    prev.ctaButtonClassName === next.ctaButtonClassName &&
    prev.ctaButtonInnerClassName === next.ctaButtonInnerClassName &&
    areHighlightsEqual(prev.highlighted, next.highlighted) &&
    JSON.stringify(prev.query) === JSON.stringify(next.query)
  );
});

// The torn-edge shapes are ~90KB of path data each. Served as static SVG
// files (public/shapes) instead of inline JSX so they stay out of the JS
// bundle of every page that renders a banner.
export const Shape = ({ className }: { className?: string }) => {
  return (
    <Image
      src="/shapes/page-banner-edge.svg"
      alt=""
      aria-hidden="true"
      width={1920}
      height={27}
      className={cn(`w-full h-auto`, className)}
    />
  );
};

export const ShapeSm = ({ className }: { className?: string }) => {
  return (
    <Image
      src="/shapes/page-banner-edge-sm.svg"
      alt=""
      aria-hidden="true"
      width={390}
      height={27}
      className={cn(`w-full h-auto`, className)}
    />
  );
};
