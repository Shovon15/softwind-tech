import { SITE_INFORMATION } from "@/config/seo";
import { absoluteUrl } from "./common";

export interface IBreadcrumbEntry {
  name: string;
  /** Route path from `src/config/routes.ts` (e.g. `/blog`). */
  path: string;
}

/**
 * BreadcrumbList node without `@context`, for embedding inside a page's
 * `@graph`. The trail must mirror the page's real position in the site,
 * starting at Home. The root item is emitted without a trailing slash so it
 * matches the canonical site url used everywhere else.
 */
export function getBreadcrumbNode(items: IBreadcrumbEntry[], id?: string) {
  return {
    "@type": "BreadcrumbList",
    ...(id ? { "@id": id } : {}),
    itemListElement: items.map(({ name, path }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: path === "/" ? SITE_INFORMATION.url : absoluteUrl(path),
    })),
  };
}

/** Standalone BreadcrumbList, for pages that emit it as its own script tag. */
export function getBreadcrumbJsonLd(items: IBreadcrumbEntry[], id?: string) {
  return {
    "@context": "https://schema.org",
    ...getBreadcrumbNode(items, id),
  };
}
