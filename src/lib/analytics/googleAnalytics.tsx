"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
interface TrackGAEventParams {
  action: string;
  content_category?: string;
  content_name?: string;
  [key: string]: any;
}

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}

export const trackCustomGAEvent = ({
  action,
  content_category,
  content_name,
  ...otherParams
}: TrackGAEventParams) => {
  // @ts-ignore
  if (typeof window !== "undefined" && typeof window.gtag === "function") {

    // @ts-ignore
    window.gtag("event", action, {
      ...(content_name && { event_label: content_name }),
      ...(content_category && { event_category: content_category }),
      ...otherParams,
    });
  }
};

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: any) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();
    if (window?.gtag) {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  return (
    <Suspense>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </Suspense>
  );
}
