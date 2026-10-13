import BlogImg from "@/components/common/image/img-placeholder.png";
import ImageComponent from "@/components/common/image";
import { formatDate } from "@/utils/helpers/formatData";
import NavLink from "../link/NavLink";
const SideBlogCard = ({ data }: any) => {
  return (
    <NavLink href={`/blog/${data?.slug}`} className="flex justify-start items-start gap-5">
      <div className="w-1/2 lg:w-[57%]">
        <ImageComponent src={data?.thumb || BlogImg} alt={data?.title || "Blog image"} />
      </div>
      <div className="flex-1">
        <h3 className="font-heading text-base text-[#FFFFFF] mt-1 leading-[130%]">
          {data?.title || "Blog Title"}
        </h3>
        <p className="font-body text-sm text-[#A1A8AE] mt-1">
          {data?.published ? formatDate(data.published) : ""}
        </p>
      </div>
    </NavLink>
  );
};

export default SideBlogCard;
