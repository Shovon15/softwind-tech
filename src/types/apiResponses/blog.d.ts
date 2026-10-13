interface IImage {
  id: number;
  url: string;
  alt: string | null;
  order: number;
}

interface ICustomBlockData {
  content: string;
  image_position: string;
  images: IImage[];
}

interface IBlock {
  title: string;
  slug: string;
  type: string;
  order: number;
  data: ICustomBlockData;
}

interface IBlogItem {
  title: string;
  subtitle: string | null;
  slug: string;
  excerpt: string | null;
  thumb: string;
  thumbSd: string | null;
  published: string;
  tags: string[];
}

interface IPaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

interface IPaginatedBlogItems {
  current_page: number;
  data: IBlogItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: IPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface IMeta {
  title: string;
  keyword: string;
  content: string;
}

interface IBlogPageData {
  title: string;
  subtitle: string;
  slug: string;
  content: string;
  template: string;
  cover: string;
  coverSd: string;
  thumb: string;
  visible: boolean;
  blocks: IBlock[];
  featured: IBlogItem[];
  items: IPaginatedBlogItems;
  meta: IMeta;
}

interface IBlogResponse {
  success: boolean;
  message: string;
  data: IBlogPageData;
}
