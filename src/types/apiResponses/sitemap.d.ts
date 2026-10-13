interface ISitemapItem {
  type: "page" | "blog" | "location" | string;
  name: string;
  slug: string;
  path: string;
  lastmod: string;
  priority: number;
}

interface ISitemapResponse {
  success: boolean;
  message: string;
  data: ISitemapItem[];
}
