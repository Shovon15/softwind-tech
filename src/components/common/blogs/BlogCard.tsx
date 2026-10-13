import ImageComponent from "@/components/common/image";
import NavLink from "@/components/common/link/NavLink";
import routes from "@/config/routes";
import { formatDate } from "@/utils/helpers/formatData";

type Blog = {
  title: string;
  subtitle: string;
  slug: string;
  excerpt: string;
  thumb: string | null;
  thumbSd: string | null;
  published: string;
  tags: string[];
};

type IProps = {
  isMainBlog?: boolean;
  isBgBlack?: boolean;
  className?: string;
  data?: IBlogItem;
};

const BlogCard = ({
  isMainBlog = false,
  isBgBlack = false,
  className,
  data,
}: IProps) => {
  // Slugs can contain spaces/unsafe chars from the CMS — encode so the URL
  // doesn't break.
  const TitleTag = isMainBlog ? "h2" : "h3";
  const blogHref = `${routes.blog}/${encodeURIComponent(data?.slug ?? "")}`;

  return (
    <div
      className={`grid ${
        isMainBlog
          ? "grid-cols-1 lg:grid-cols-2 items-center"
          : "grid-cols-1 items-start"
      } ${isBgBlack ? "gap-4" : "gap-9"} justify-center  h-fit ${className}`}
    >
      {/* Main clickable area */}
      <NavLink href={blogHref}>
        <div className="relative">
          <ImageComponent src={data?.thumb} alt={data?.title ?? "Blog post"} />

          <div className="absolute top-[6.5%] left-[7.5%] flex flex-wrap gap-1">
            {data?.tags?.map((tag, index) => (
              <p
                key={index}
                className="font-normal font-body text-[clamp(0.875rem,1.042vw,1.25rem)] text-white px-3 pb-1 rounded-full bg-[#00000080] backdrop-blur-[1px] w-fit"
              >
                {tag}
              </p>
            ))}
          </div>
        </div>
      </NavLink>

      <div>
        <TitleTag
          className={`font-heading font-normal text-[clamp(1.5rem,1.875vw,2.25rem)] ${
            isBgBlack ? "text-[#FFFFFF]" : "text-[#121416]"
          }`}
        >
          {data?.title}
        </TitleTag>

        <div
          className={`flex justify-start items-center gap-3 font-body text-lg mt-2 font-normal ${
            isBgBlack ? "text-[#FFFFFF]" : "text-[#6C757D]"
          }`}
        >
          <p>{data?.published && formatDate(data?.published)}</p>
        </div>

        <p
          className={`font-normal font-body text-base mt-3  ${
            isBgBlack ? "text-[#FFFFFF]" : "text-[#6C757D]"
          }`}
        >
          {data?.excerpt}
        </p>

        {/* Separate link */}
        <NavLink
          href={blogHref}
          className={`${isBgBlack ? "text-[#FF5C6F]" : "text-[#E4002B]"} font-body text-base font-normal uppercase underline mt-6 block`}
        >
          Read More
          <span className="sr-only"> about {data?.title}</span>
        </NavLink>
      </div>
    </div>
  );
};

export default BlogCard;
