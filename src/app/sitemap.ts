import type { MetadataRoute } from "next";
import api from "@/config/api/apiList";
import { get } from "@/lib/metadata/fetch";
import { SITE_INFORMATION } from "@/config/seo";

// Regenerate at most once per hour.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = SITE_INFORMATION.url.replace(/\/$/, "");

  const { data, error } = await get<ISitemapResponse>(api.sitemap);

  if (error || !data?.data?.length) {
    // Fall back to the home page so the route always resolves.
    return [
      {
        url: siteUrl || "/",
        lastModified: new Date(),
        priority: 1,
      },
    ];
  }

  return data.data.map((item) => {
    // `path` is server-provided and already leading-slashed ("/" for home).
    const path = item.path === "/" ? "" : item.path;

    return {
      // encodeURI keeps slugs with spaces/unicode valid in the XML output.
      url: encodeURI(`${siteUrl}${path}`),
      lastModified: item.lastmod ? new Date(item.lastmod) : new Date(),
      priority: item.priority,
    };
  });
}
