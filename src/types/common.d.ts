interface ISliderCard {
  id: number;
  model: string;
  material: string;
  gender: string;
  slug: string;
  category: string;
  image: string;
  created_at: string;
  updated_at: string | null;
  brand: string;
}

interface IStories {
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  cover_sd: string;
}

interface IPopItem {
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  cover_sd: string;
}

type IHeading = {
  children: React.ReactNode;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  className?: string;
  [key: string]: any;
};
interface IReview {
  name: string;
  rating: number;
  review: string;
  reviewed_at: string;
  source: string;
  source_url: string | null;
  avatar: string | null;
}
interface IReviewBlock {
  title: string;
  slug: string;
  type: "review";
  order: number;
  data: {
    records: IReview[];
  };
}

interface ITimeSlots {
  time: string;
  label: string;
  available: boolean;
  seats_left: number;
}

// interface IPageSectionData {
//   title: string;
//   subtitle: string;
//   headline: string;
//   icon?: StaticImageData;
//   slug: string;
//   excerpt: string;
//   cover: StaticImageData;
//   video: string;
//   coverSd: StaticImageData;
//   thumb: StaticImageData;
//   thumbSd: StaticImageData;
//   items: ISectionItem[];
// }

// interface ISectionItem {
//   title: string;
//   subtitle: string;
//   slug: string;
//   excerpt: string;
//   content: string;
//   description: string;
//   tag?: string;
//   category?: string | { slug: string, title: string };
//   order?: number;
//   icon?: StaticImageData;
//   icon_dark?: StaticImageData;
//   iconHover?: StaticImageData;
//   icon_darkHover?: StaticImageData;
//   cover: StaticImageData;
//   coverSd: StaticImageData;
//   thumb: StaticImageData;
//   thumbSd: StaticImageData;
//   lightLogo: StaticImageData;
//   lightLogoSd: StaticImageData;
//   darkLogo: StaticImageData;
//   darkLogoSd: StaticImageData;
//   location?: string;
// }
