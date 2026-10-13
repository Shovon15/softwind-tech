import routes from "@/config/routes";
import { SITE_INFORMATION } from "@/config/seo";
import {
  ORGANIZATION_ID,
  ORGANIZATION_LOGO,
  ORGANIZATION_REF,
  SITE_LANGUAGE,
  SITE_URL,
  WEBSITE_ID,
} from "./common";
import { getWebPageJsonLd } from "./webPageLd";
import { getFaqPageJsonLd, IFaqEntry } from "./faqPageLd";

type HomeJsonLdOptions = {
  telephone?: string;
  socialLinks?: string[];
  faqs?: IFaqEntry[];
};

export function getHomeJsonLd({
  telephone,
  socialLinks = [],
  faqs = [],
}: HomeJsonLdOptions = {}) {
  const name = SITE_INFORMATION.appName;
  const description = SITE_INFORMATION.metaDescription;

  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name,
      url: SITE_URL,
      description,
      logo: ORGANIZATION_LOGO,
      image: ORGANIZATION_LOGO,
      ...(telephone
        ? {
            telephone,
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone,
                contactType: "customer service",
                availableLanguage: ["English"],
              },
            ],
          }
        : {}),
      ...(socialLinks.length ? { sameAs: socialLinks } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name,
      url: SITE_URL,
      description,
      inLanguage: SITE_LANGUAGE,
      publisher: ORGANIZATION_REF,
    },
    getWebPageJsonLd({
      path: routes.home,
      name,
      description,
    }),
    ...(faqs.length ? [getFaqPageJsonLd({ path: routes.home, faqs })] : []),
  ];
}
