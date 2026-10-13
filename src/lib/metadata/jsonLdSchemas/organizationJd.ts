import { SITE_INFORMATION } from "@/config/seo";

interface IOrganizationJsonLd {
  logo: string;
  address: string;
  copyright_text: string;
  //   description: string;
  social_links: { name: string; url: string }[];
}

export function getOrganizationJsonLd({
  logo,
  address,
  copyright_text,
  //   description,
  social_links,
}: IOrganizationJsonLd) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: `${SITE_INFORMATION.appName}`,
    logo: logo,
    url: `${SITE_INFORMATION.url}`,
    // description: description || "",
    sameAs: social_links?.map((item) => item.url),
    // sameAs: [`${SITE_INFORMATION.url}`],
    contactPoint: [
      {
        "@type": "ContactPoint",
        address: "",
        contactType: "customer service",
        // email: "info@brightceramics.net",
        availableLanguage: ["English"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: "",
      postalCode: "",
      addressCountry: "",
    },
  };
}
