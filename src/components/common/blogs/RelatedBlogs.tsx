import ContentContainer from "@/components/layout/container/contentContainer";
import MainTitle from "../Titles/MainTitle";
import BlogCard from "./BlogCard";
import SideBlogCard from "./SideBlogCard";
import { HighlightHeading } from "../typography/HighlightHeading";

const RelatedBlogs = ({ text1, text2, data }: any) => {
  return (
    <div className=" bg-[#000000] py-10 lg:py-18">
      <ContentContainer>
        <HighlightHeading
          text={text1}
          highlight={["Blogs"]}
          highlightClassName="text-primary"
          className="text-white flex justify-center"
        />
        {/* <MainTitle text1={text1} text2={text2} textColor="text-white" /> */}
        <div className=" grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-7.5 mt-9 lg:mt-16">
          <div className="col-span-1 lg:col-span-8">
            <BlogCard isBgBlack={true} data={data?.[0]} />
          </div>
          <div className="col-span-1 lg:col-span-4 space-y-7.5">
            {data?.slice(1).map((item: any, index: number) => (
              <SideBlogCard key={index} data={item} />
            ))}
          </div>
        </div>
      </ContentContainer>
    </div>
  );
};

export default RelatedBlogs;
