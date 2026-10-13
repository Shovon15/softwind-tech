import api from "@/config/api/apiList";
import routes from "@/config/routes";
import { get } from "./fetch";
import { metaDataGenerator } from "./generateMetadata";

/**
 * Blog details needs its own metadata mechanism.
 *
 * Every other page returns a `meta` object ({ title, content, meta_image, keyword })
 * which `GetMetaData()` reads. The blog detail endpoint (`/blog/{slug}`) instead returns:
 *
 *   { data: { blog: { title, excerpt, thumb, thumbSd, published, tags,
 *                     meta_title, meta_keyword, meta_description }, related, latest } }
 *
 * so it is mapped here separately, with the blog's own fields as fallbacks.
 */

type GetBlogMetaDataProps = {
  slug: string;
};

const stripHtml = (html?: string | null) =>
  html
    ? html
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";

const truncate = (text: string, max = 160) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

export const GetBlogMetaData = async ({ slug }: GetBlogMetaDataProps) => {
  const canonicalURL = routes.blogDetails(slug);

  try {
    const response: any = await get(api.blogDetail(slug));
    const blog = response?.data?.data?.blog;

    if (!blog) {
      return metaDataGenerator({ canonicalURL });
    }

    const title = blog.meta_title || blog.title || undefined;

    const description =
      blog.meta_description ||
      stripHtml(blog.excerpt) ||
      blog.subtitle ||
      truncate(stripHtml(blog.content)) ||
      undefined;

    const keywordsArray = blog.meta_keyword
      ? blog.meta_keyword
          .split(",")
          .map((k: string) => k.trim())
          .filter(Boolean)
      : Array.isArray(blog.tags) && blog.tags.length
        ? blog.tags
        : undefined;

    const image = blog.thumbSd || blog.thumb;

    const openGraphImages = image
      ? [{ url: image, width: 1200, height: 630, alt: title }]
      : undefined;

    return metaDataGenerator({
      title,
      description,
      canonicalURL,
      keywords: keywordsArray,
      openGraphImages,
      twitterImages: image ? [image] : undefined,
      ogType: "article",
      article: {
        publishedTime: blog.published || undefined,
        tags: Array.isArray(blog.tags) ? blog.tags : undefined,
      },
    });
  } catch (error) {
    console.error("Blog Metadata Error:", error);
    return metaDataGenerator({ canonicalURL });
  }
};
