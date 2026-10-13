import { get } from "./fetch";
import { metaDataGenerator } from "./generateMetadata";

type GetMetaDataProps = {
  url?: string;
  siteUrl?: string;
};

export const GetMetaData = async ({ url, siteUrl }: GetMetaDataProps) => {
  try {
    if (!url) {
      return metaDataGenerator({});
    }

    const response: any = await get(url);

    const meta = response?.data?.data?.meta ?? response?.data?.meta;

    if (!meta) {
      return metaDataGenerator({});
    }

    const { title, content, meta_image, keyword } = meta;

    const keywordsArray = keyword
      ? keyword.split(",").map((k: string) => k.trim())
      : undefined;

    const openGraphImages = meta_image
      ? [
          {
            url: meta_image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ]
      : undefined;

    return metaDataGenerator({
      title,
      description: content,
      canonicalURL: siteUrl,
      keywords: keywordsArray,
      openGraphImages,
      twitterImages: meta_image ? [meta_image] : undefined,
    });
  } catch (error) {
    console.error("Metadata Error:", error);
    return metaDataGenerator({});
  }
};
