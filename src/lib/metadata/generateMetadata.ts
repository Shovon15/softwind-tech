import { SITE_INFORMATION } from "@/config/seo";
import { Metadata } from "next";

type GenerateMetadataProps = {
  title?: string;
  description?: string;
  keywords?: string | string[];
  canonicalURL?: string;
  openGraphImages?: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  }[];
  twitterImages?: string[];
  /** Tell search engines not to index the page or follow its links. */
  noIndex?: boolean;
  /** Open Graph object type. Defaults to "website"; blog details use "article". */
  ogType?: "website" | "article";
  /** Only used when ogType is "article". */
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
  };
};

export const metaDataGenerator = ({
  title,
  description,
  keywords,
  canonicalURL,
  openGraphImages,
  twitterImages,
  noIndex = false,
  ogType = "website",
  article,
}: GenerateMetadataProps): Metadata => {
  const { metaTitle, metaDescription, url: defaultURL } = SITE_INFORMATION;
  const siteURL = defaultURL || "http://localhost:4002";
  const metadataBase = new URL(siteURL);
  const defaultOpenGraphImages = [
    {
      url: SITE_INFORMATION.ogImage,
      width: 1200,
      height: 630,
      alt: SITE_INFORMATION.appName,
    },
  ];
  const defaultTwitterImages = [SITE_INFORMATION.socialImage];

  return {
    metadataBase,
    title: {
      default: title ?? metaTitle,
      template: `%s | ${SITE_INFORMATION.appName}`,
    },
    description: description ?? metaDescription,
    alternates: {
      canonical: canonicalURL ?? siteURL,
    },
    keywords: keywords ?? SITE_INFORMATION.keywords,
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: { index: false, follow: false },
        }
      : {
          index: true,
          follow: true,
          nocache: false,
        },
    openGraph: {
      title: title ?? metaTitle,
      description: description ?? metaDescription,
      url: canonicalURL ?? siteURL,
      siteName: SITE_INFORMATION.appName,
      images: openGraphImages ?? defaultOpenGraphImages,
      locale: "en_US",
      ...(ogType === "article"
        ? {
            type: "article" as const,
            publishedTime: article?.publishedTime,
            modifiedTime: article?.modifiedTime,
            authors: article?.authors,
            tags: article?.tags,
          }
        : { type: "website" as const }),
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? metaTitle,
      description: description ?? metaDescription,
      images: twitterImages ?? defaultTwitterImages,
    },
    verification: {
      google: "",
    },
  };
};
