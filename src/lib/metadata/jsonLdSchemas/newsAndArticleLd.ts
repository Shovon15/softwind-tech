// import { SITE_INFORMATION } from "@/config/seo";
// interface INewsAndArticleJsonLd {
//   type: string;
//   description: string;
// }

// export function getNewsAndArticleJsonLd({
//   type,
//   description,
// }: INewsAndArticleJsonLd) {
//   return {
//     "@context": "https://schema.org",
//     "@type":
//       type === "news"
//         ? "NewsArticle"
//         : type === "blog"
//         ? "Article"
//         : type === "event"
//         ? "Event"
//         : "",
//     headline: `Bright Ceramics ${
//       type === "news"
//         ? "NewsArticle"
//         : type === "blog"
//         ? "Article"
//         : type === "event"
//         ? "Event"
//         : ""
//     }`,
//     url: `${SITE_INFORMATION.url}/${type}`,
//     name: `Bright Ceramics ${
//       type === "news"
//         ? "NewsArticle"
//         : type === "blog"
//         ? "Article"
//         : type === "event"
//         ? "Event"
//         : ""
//     }`,
//     description: description,
//     publisher: {
//       "@type": "Organization",
//       name: "Bright Ceramics",
//       logo: {
//         "@type": "ImageObject",
//         url: `${SITE_INFORMATION.url}/logo.png`,
//       },
//       contactPoint: {
//         "@type": "ContactPoint",
//         telephone: "+8809638113300",
//         contactType: "Customer Service",
//         areaServed: "BD",
//         availableLanguage: "English",
//       },
//     },
//     mainEntityOfPage: `${SITE_INFORMATION.url}/${type}`,
//   };
// }
