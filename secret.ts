// require("dotenv").config({ path: ".env" });

export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "";
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";
export const CAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || "";
export const CAPTCHA_SECRET_KEY = process.env.CAPTCHA_SECRET_KEY || "";
export const NODE_ENV = process.env.NEXT_PUBLIC_NODE_ENV || "";
