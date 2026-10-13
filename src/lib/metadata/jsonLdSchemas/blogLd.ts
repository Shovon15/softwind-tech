import routes from "@/config/routes";
import { SITE_INFORMATION } from "@/config/seo";
import { absoluteUrl } from "./common";
import { getBreadcrumbJsonLd } from "./breadcrumbLd";

const BLOG_URL = absoluteUrl(routes.blog);

const BLOG_NAME = `${SITE_INFORMATION.appName} Blog`;

const BLOG_DESCRIPTION = `Insights, tutorials and news from the ${SITE_INFORMATION.appName} team.`;

/**
 * `blogPost` is built from the posts the blog page actually renders — the
 * paginated list plus the featured/trending ones — deduped by slug so a post
 * appearing in both is only declared once.
 */
function getBlogPosts(data?: IBlogPageData | null) {
  const posts = [...(data?.items?.data ?? []), ...(data?.featured ?? [])];
  const seen = new Set<string>();

  return posts
    .filter((post) => {
      if (!post?.slug || seen.has(post.slug)) return false;
      seen.add(post.slug);
      return true;
    })
    .map((post) => {
      const url = absoluteUrl(routes.blogDetails(post.slug));

      return {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        url,
        ...(post.published ? { datePublished: post.published } : {}),
        ...(post.thumb ? { image: post.thumb } : {}),
      };
    });
}

export function getBlogJsonLd(data?: IBlogPageData | null) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": `${BLOG_URL}#blog`,
      url: BLOG_URL,
      name: BLOG_NAME,
      description: BLOG_DESCRIPTION,
      blogPost: getBlogPosts(data),
    },
    getBreadcrumbJsonLd([
      { name: "Home", path: routes.home },
      { name: "Blog", path: routes.blog },
    ]),
  ];
}
