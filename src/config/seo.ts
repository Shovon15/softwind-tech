import { FRONTEND_URL } from "../../secret";

const SITE_URL = FRONTEND_URL || "";

export const SITE_INFORMATION = {
  appName: "Softwind Tech",

  metaTitle: "Softwind Tech",
  metaDescription:
    "Softwind Tech builds modern web, mobile and software solutions for growing businesses.",
  keywords: ["softwind tech", "software development", "web development"],

  url: SITE_URL,

  socialTitle: "Softwind Tech",
  socialDescription:
    "Softwind Tech builds modern web, mobile and software solutions for growing businesses.",
  socialImage: `${SITE_URL}/logo.svg`,

  ogImage: `${SITE_URL}/logo.svg`,
};
