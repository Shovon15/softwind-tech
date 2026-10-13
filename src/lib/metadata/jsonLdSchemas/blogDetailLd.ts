import { SITE_INFORMATION } from "@/config/seo";
import routes from "@/config/routes";
import { ORGANIZATION_ID, ORGANIZATION_LOGO, absoluteUrl } from "./common";
import { getBreadcrumbNode } from "./breadcrumbLd";
import { extractFaqsFromHtml } from "./extractFaqsFromHtml";

const BLOG_ID = `${absoluteUrl(routes.blog)}#blog`;

const AUTHOR = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_INFORMATION.appName,
};

const PUBLISHER = {
  ...AUTHOR,
  logo: {
    "@type": "ImageObject",
    url: ORGANIZATION_LOGO,
  },
};

/**
 * Article + BreadcrumbList + FAQPage for a single post, all derived from the
 * blog detail API. The FAQ has no field of its own — it lives inside the post
 * body, so it is parsed out of the `#blog-faq` block (see
 * `extractFaqsFromHtml`) and the node is dropped when a post has no FAQ.
 */
export function getBlogDetailJsonLd(blog?: IBlogDetail | null) {
  if (!blog?.slug) return null;

  const url = absoluteUrl(routes.blogDetails(blog.slug));
  const description = blog.meta_description || blog.excerpt || "";
  const image = blog.thumbSd || blog.thumb || "";
  const faqs = extractFaqsFromHtml(blog.content);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
        headline: blog.title,
        ...(description ? { description } : {}),
        ...(image ? { image } : {}),
        ...(blog.published
          ? { datePublished: blog.published, dateModified: blog.published }
          : {}),
        author: AUTHOR,
        publisher: PUBLISHER,
        ...(blog.meta_keyword ? { keywords: blog.meta_keyword } : {}),
        ...(blog.category?.title
          ? { articleSection: blog.category.title }
          : {}),
        isPartOf: { "@id": BLOG_ID },
      },
      getBreadcrumbNode(
        [
          { name: "Home", path: routes.home },
          { name: "Blog", path: routes.blog },
          { name: blog.title, path: routes.blogDetails(blog.slug) },
        ],
        `${url}#breadcrumb`,
      ),
      ...(faqs.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              mainEntity: faqs.map(({ question, answer }) => ({
                "@type": "Question",
                name: question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: answer,
                },
              })),
            },
          ]
        : []),
    ],
  };
}
