import { BACKEND_URL } from "../../../secret";

const apiPrefix = {
  page: `${BACKEND_URL}/pages`,
};

const api = {
  page: {
    home: `${apiPrefix.page}/home`,
    about: `${apiPrefix.page}/about`,
    faq: `${apiPrefix.page}/faq`,
    blog: `${apiPrefix.page}/blog`,
    contact: `${apiPrefix.page}/contact`,

    termsAndConditions: `${apiPrefix.page}/terms-and-conditions`,
    privacyPolicy: `${apiPrefix.page}/privacy-policy`,
  },
  siteInfo: `${BACKEND_URL}/site-info`,

  //post routes
  contact: `${BACKEND_URL}/contact`,
  blogDetail: (slug: string) => `${BACKEND_URL}/blog/${slug}`,
  sitemap: `${BACKEND_URL}/sitemap`,
};
export default api;
