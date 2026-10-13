"use client";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import Heading1 from "@/components/common/typography/Heading1";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="h-full min-h-[calc(100dvh-338px)] md:min-h-[calc(100dvh-360px)] w-full flex items-center justify-center">
      <div className="max-w-[670px] w-[90%] mx-auto">
        <div className="w-full mx-auto">
          {/* <ImageComponent src={pageNotFound} alt="Sad Face Emoji" /> */}
        </div>
        <div className="flex flex-col items-center justify-center text-center mx-auto w-full">
          <Heading1
            wrapperClassName="mx-auto w-fit"
            className="text-center text-primary"
          >
            Page Not Found
          </Heading1>
          <p
            className={
              "font-dmSans font-[300] text-white py-5 text-[clamp(14px,1.2vw,16px)] leading-[clamp(20px,1.6vw,26px)]"
            }
          >
            We’re sorry, the page you requested could not be found Please go
            back to the homepage
          </p>

          <Link href="/" className="text-center my-5">
            <PrimaryButton className=" ">Home</PrimaryButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
