interface IBlogPost {
  title: string;
  subtitle: string | null;
  slug: string;
  excerpt: string | null;
  thumb: string;
  thumbSd: string | null;
  published: string;
  tags: string[];
  read_time: string | null;
}

interface IBlogCategory {
  title: string;
  slug: string;
  description: string | null;
  thumb: string | null;
}

interface IBlogDetail extends IBlogPost {
  content: string;
  is_featured: boolean;
  category: IBlogCategory | null;
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
}

interface IBlogDetailData {
  blog: IBlogDetail;
  related: IBlogPost[];
  latest: IBlogPost[];
}

interface IBlogDetailResponse {
  success: boolean;
  message: string;
  data: IBlogDetailData;
}
