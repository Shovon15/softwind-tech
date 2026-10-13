// interface ICaseStudy {
//   title: string;
//   subtitle: string | null;
//   slug: string;
//   excerpt: string | null;
//   description: string | null;
//   cover: string;
//   coverSd: string | null;
//   thumb: string | null;
//   thumbSd: string | null;
// }

// interface IAdditional {
//   excerpt: string;
//   description: string | null;
//   case_study: ICaseStudy[];
// }

// interface IChildItem {
//   title: string;
//   type: string;
//   url: string;
// }

interface IMenuItem {
  title: string;
  slug: string | null;
  type: string;
  children?: IMenuItem[];
}

interface IHeaderSection {
  name: "Header";
  slug: "header";
  items: IMenuItem[];
}

interface IFooterSection {
  name: "Footer";
  slug: "footer";
  items: IMenuItem[];
}
interface ISocialLinksSection {
  name: "Social Links";
  slug: "social_Links";
  items: ISocialItem[];
}

interface ISocialItem {
  name: string;
  url: string;
}

interface ISettingsSection {
  name: "Settings";
  slug: "settings";
  items: ISettingItem[];
}

interface ISettingItem {
  phone?: string;
  address?: string;
  footer_title?: string;
  footer_description?: string;
  promo_bar?: string;
  copyright_text?: string;
  logo?: string;
  footer_logo?: string;
  footer_image?: string;
  footer_image_sd?: string;
  tax_rate?: string;
}

interface INavigationSchema {
  header: IHeaderSection;
  footer: IFooterSection;
  settings: ISettingsSection;
  socialLinks: ISocialLinksSection;
}

type INavigationState = INavigationSchema & {
  dataFetched: boolean;
};
