import routes from "@/config/routes";
import { useRouter } from "next/navigation";
type SearchItem = {
  type?: string;
  slug?: string;
  [key: string]: any;
};

export const useRedirect = () => {
  const router = useRouter();

  const handleRedirect = (item: SearchItem) => {
    const type = item?.type?.toString()?.toLowerCase();
    const slug = item?.slug || item?.url || "";

    // switch (type) {
    //   case "category":
    //     if (slug === routes.alCollection) {
    //       router.push(routes.product);
    //       return;
    //     }
    //     router.push(`${routes.category}/${slug}`);
    //     break;
    //   case "product":
    //     router.push(`${routes.product}/${slug}`);
    //     break;
    //   case "dealer":
    //     router.push(routes.dealer);
    //     break;
    //   case "news":
    //     router.push(`/${type}/${slug}`);
    //     break;
    //   case "event":
    //     router.push(`/${type}s/${slug}`);
    //     break;
    //   case "blog":
    //     router.push(`/${type}s/${slug}`);
    //     break;
    //   case "page":
    //     if (item?.url === "all-collection") {
    //       router.push(routes.product);
    //       return;
    //     }
    //     // router.push(`/${slug}`);
    //     router.push(`${routes.category}/${slug}`);
    //     break;
    //   default:
    //     break;
    // }
  };

  return { handleRedirect };
};
