import { describe, expect, it } from "vitest";
import { getBlogDetailJsonLd } from "../blogDetailLd";

const blog = {
  title: "What Is Next.js?",
  subtitle: null,
  slug: "what-is-nextjs",
  excerpt: null,
  thumb: "https://media.softwindtech.com/storage/244/thumb.webp",
  thumbSd: "https://media.softwindtech.com/storage/245/cover.webp",
  published: "2026-08-16",
  tags: ["Next.js"],
  read_time: "13",
  content: "<div><p>Body copy.</p></div>",
  is_featured: false,
  category: {
    title: "Next.js",
    slug: "nextjs",
    description: null,
    thumb: null,
  },
  meta_title: "What Is Next.js?",
  meta_keyword: "what is Next.js, Next.js meaning",
  meta_description: "Discover the real meaning of Next.js.",
} satisfies IBlogDetail;

const graphOf = (post: IBlogDetail) =>
  (getBlogDetailJsonLd(post)?.["@graph"] ?? []) as any[];

describe("getBlogDetailJsonLd", () => {
  it("returns nothing without a post", () => {
    expect(getBlogDetailJsonLd(null)).toBeNull();
  });

  it("builds the Article node from the api fields", () => {
    const [article] = graphOf(blog);

    expect(article).toEqual({
      "@type": "Article",
      "@id": "https://softwindtech.com/blog/what-is-nextjs#article",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://softwindtech.com/blog/what-is-nextjs",
      },
      headline: "What Is Next.js?",
      description: "Discover the real meaning of Next.js.",
      image: "https://media.softwindtech.com/storage/245/cover.webp",
      datePublished: "2026-08-16",
      dateModified: "2026-08-16",
      author: {
        "@type": "Organization",
        "@id": "https://softwindtech.com/#organization",
        name: "Softwind Tech",
      },
      publisher: {
        "@type": "Organization",
        "@id": "https://softwindtech.com/#organization",
        name: "Softwind Tech",
        logo: {
          "@type": "ImageObject",
          url: "https://softwindtech.com/logo.svg",
        },
      },
      keywords: "what is Next.js, Next.js meaning",
      articleSection: "Next.js",
      isPartOf: { "@id": "https://softwindtech.com/blog#blog" },
    });
  });

  it("trails Home > Blog > post in the breadcrumb", () => {
    const breadcrumb = graphOf(blog)[1];

    expect(breadcrumb["@id"]).toBe(
      "https://softwindtech.com/blog/what-is-nextjs#breadcrumb",
    );
    expect(breadcrumb.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://softwindtech.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://softwindtech.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "What Is Next.js?",
        item: "https://softwindtech.com/blog/what-is-nextjs",
      },
    ]);
  });

  it("omits the FAQPage node when the body has no faq section", () => {
    expect(graphOf(blog).map((node) => node["@type"])).toEqual([
      "Article",
      "BreadcrumbList",
    ]);
  });

  it("builds the FAQPage node from the body's #blog-faq section", () => {
    const content = `
      <div>
        <p>Body copy.</p>
        <div id="blog-faq">
          <h2>Frequently Asked Questions</h2>
          <h3>What is Next.js chicken?</h3>
          <p class="mb-4">Diced chicken breast on a teppan grill.</p>
          <h3>What is Next.js steak?</h3>
          <p class="mb-4">Sliced sirloin, ribeye, or filet mignon.</p>
        </div>
        <h2>Wrapping Up</h2>
        <p>Not a question.</p>
      </div>`;

    const faq = graphOf({ ...blog, content })[2];

    expect(faq).toEqual({
      "@type": "FAQPage",
      "@id": "https://softwindtech.com/blog/what-is-nextjs#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Next.js chicken?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Diced chicken breast on a teppan grill.",
          },
        },
        {
          "@type": "Question",
          name: "What is Next.js steak?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sliced sirloin, ribeye, or filet mignon.",
          },
        },
      ],
    });
  });

  it("drops fields the api left empty", () => {
    const article = graphOf({
      ...blog,
      thumbSd: null,
      category: null,
      meta_keyword: "",
      meta_description: "",
    })[0];

    expect(article.image).toBe("https://media.softwindtech.com/storage/244/thumb.webp");
    expect(article).not.toHaveProperty("description");
    expect(article).not.toHaveProperty("keywords");
    expect(article).not.toHaveProperty("articleSection");
  });
});
