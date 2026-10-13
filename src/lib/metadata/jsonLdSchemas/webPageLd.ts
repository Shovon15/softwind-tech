import {
  ORGANIZATION_REF,
  SITE_LANGUAGE,
  WEBSITE_REF,
  absoluteUrl,
} from "./common";

interface IWebPageJsonLd {
  /** Route path from `src/config/routes.ts` (e.g. `/menu`). */
  path: string;
  name: string;
  description: string;
}

/**
 * Generic WebPage node. Every page's node has the same shape and only differs
 * by url / name / description, so build it here instead of per page.
 */
export function getWebPageJsonLd({ path, name, description }: IWebPageJsonLd) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: SITE_LANGUAGE,
    isPartOf: WEBSITE_REF,
    about: ORGANIZATION_REF,
    publisher: ORGANIZATION_REF,
  };
}
