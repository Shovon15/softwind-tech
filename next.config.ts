import type { NextConfig } from "next";

// Image hosts allowed by next/image, derived from the API/media env vars.
const remoteHosts = [
  process.env.NEXT_PUBLIC_BACKEND_URL,
  process.env.NEXT_PUBLIC_MEDIA_URL,
]
  .map((url) => {
    try {
      return url ? new URL(url).hostname : null;
    } catch {
      return null;
    }
  })
  .filter((host): host is string => Boolean(host));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      // Drop Next's always-on client polyfills (see src/lib/polyfills/empty.js).
      // Matches the literal specifier in next/dist/client/app-globals.js.
      "../build/polyfills/polyfill-module": "./src/lib/polyfills/empty.js",
    },
  },
  images: {
    qualities: [50, 75, 100],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: remoteHosts.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
  async headers() {
    return [
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
