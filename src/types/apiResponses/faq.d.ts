interface IFaqItem {
  question: string;
  answer: string;
}

interface IFaqData {
  title: string;
  slug: string;
  content: string;
  template: string;
  cover: string;
  coverSd: string;
  visible: boolean;
  blocks: [];
  faqs: IFaqItem[];
  meta: any[];
}

interface IFaqResponse {
  success: boolean;
  message: string;
  data: IFaqData;
}