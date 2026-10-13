import { Inter, Poppins } from "next/font/google";

export const HeadingFont = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const BodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
