"use client";
import PageBanner from "@/components/layout/container/PageBanner";
import { useIsMobile } from "@/hooks/useMobile";
import MainTitle from "../Titles/MainTitle";
import Link from "next/link";
import { SITE_INFORMATION } from "@/config/seo";

const ThankYou = ({
  data,
  mainText = "Thank You !",
  subText = "Your request has been successfully submitted!",
  description = "Thanks for reaching out. A member of our team will get back to you as soon as possible.",
  hrefLink = "/",
  buttonText = "back to home",
}: any) => {
  const { isMobile } = useIsMobile();
  return (
    <>
      <PageBanner
        bgImage={isMobile ? data?.coverSd : data?.cover}
        title={data?.title}
        highlighted={[SITE_INFORMATION.appName]}
        description={data?.content}
        contentClassName="!pt-28"
      />
      <div className="px-2 lg:px-14 xl:px-20 h-full flex flex-col items-center text-center justify-start w-[95%] lg:w-[60%] mx-auto py-5 lg:py-20 shadow-2xl my-10 lg:my-20 rounded-2xl bg-[#F2F2F2] ">
        <MainTitle text1="" text2={mainText} />
        <p className="font-normal font-body text-lg lg:text-2xl text-[#000000] mt-5">
          {subText}
        </p>
        <p className="font-normal font-body text-sm lg:text-base text-[#000000] mt-5">
          {description}
        </p>
        <Link
          href={hrefLink}
          className=" font-medium font-body text-sm lg:text-base mt-9 lg:mt-14 block bg-[#E4002B] text-white px-8 py-3 lg:px-11 lg:py-4 rounded-full hover:bg-[#E4002B] transition-colors uppercase"
        >
          {buttonText}
        </Link>
      </div>
    </>
  );
};

export default ThankYou;
