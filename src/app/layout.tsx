import type { Metadata } from "next";
import "./globals.css";
import { BodyFont, HeadingFont } from "./font";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SmoothScroll from "@/components/layout/container/SmoothScroll";
import ReduxProvider from "@/store/provider";
import ToastListener from "@/components/common/toast/toastListener";
import { SITE_INFORMATION } from "@/config/seo";

export const metadata: Metadata = {
  title: SITE_INFORMATION.metaTitle,
  description: SITE_INFORMATION.metaDescription,
  keywords: SITE_INFORMATION.keywords,
  metadataBase: new URL(SITE_INFORMATION.url || "http://localhost:4004"),
  openGraph: {
    title: SITE_INFORMATION.socialTitle,
    description: SITE_INFORMATION.socialDescription,
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: SITE_INFORMATION.appName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_INFORMATION.socialTitle,
    description: SITE_INFORMATION.socialDescription,
    images: ["/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="darkreader-lock"></meta>
      </head>
      <body
        className={`${HeadingFont.variable} ${BodyFont.variable} font-body antialiased`}
      >
        {/* End Google Tag Manager (noscript) */}
        <ReduxProvider>
          <SmoothScroll>
            <Header />
            <div className="min-h-[calc(100dvh-338px)] md:min-h-[calc(100dvh-360px)] bg-background">
              {children}
            </div>
            <Footer />
          </SmoothScroll>
          <ToastListener />
        </ReduxProvider>
      </body>
    </html>
  );
}
