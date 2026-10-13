import { absoluteUrl } from "./common";

export interface IFaqEntry {
  question: string;
  answer: string;
}

interface IFaqPageJsonLd {
  /** Route path from `src/config/routes.ts` (e.g. `/faq`). */
  path: string;
  faqs: IFaqEntry[];
}

/**
 * FAQPage node. Unlike WebPage/Organization this one is rich-result eligible,
 * so the questions must match what is actually visible on the page.
 * `isPartOf` points at the same page's WebPage node from `webPageLd.ts`.
 */
export function getFaqPageJsonLd({ path, faqs }: IFaqPageJsonLd) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    isPartOf: { "@id": `${url}#webpage` },
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}
