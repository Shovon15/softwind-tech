import decodeHtmlEntities from "@/utils/helpers/decodeHtmlEntities";
import { SITE_INFORMATION } from "@/config/seo";

/** Site root, always with a trailing slash (`https://softwindtech.com/`). */
export const SITE_URL = `${SITE_INFORMATION.url}/`;

/** Absolute URL for a route path from `src/config/routes.ts` (e.g. `/about`). */
export const absoluteUrl = (path: string) =>
  `${SITE_INFORMATION.url}${path === "/" ? "/" : path}`;

/**
 * Stable node ids. Every page's JSON-LD references the same Organization and
 * WebSite nodes (defined once on the homepage) instead of redeclaring them.
 */
export const ORGANIZATION_ID = `${SITE_URL}#organization`;
export const WEBSITE_ID = `${SITE_URL}#website`;

export const ORGANIZATION_REF = { "@id": ORGANIZATION_ID };
export const WEBSITE_REF = { "@id": WEBSITE_ID };

export const ORGANIZATION_LOGO = absoluteUrl("/logo.svg");

export const SITE_LANGUAGE = "en-US";

/**
 * JSON-LD values must be plain text — the CMS returns rich text for fields like
 * FAQ answers, so tags are stripped and entities decoded before they go in.
 */
export const toPlainText = (html?: string | null) =>
  html
    ? decodeHtmlEntities(
        html
          .replace(/<(script|style)[\s>][\s\S]*?<\/\1\s*>/gi, "")
          .replace(/<[^>]+>/g, " "),
      )
        .replace(/\s+/g, " ")
        .trim()
    : "";

/**
 * `addressCountry` should be an ISO 3166-1 country code, but the API sends the
 * display name ("United States"). Anything unrecognised is passed through
 * rather than dropped, since a country name is still valid Text.
 */
const COUNTRY_CODES: Record<string, string> = {
  "united states": "US",
  "united states of america": "US",
  usa: "US",
  canada: "CA",
};

export const toCountryCode = (country?: string | null) => {
  const value = country?.trim();
  if (!value) return undefined;

  return COUNTRY_CODES[value.toLowerCase()] ?? value;
};
