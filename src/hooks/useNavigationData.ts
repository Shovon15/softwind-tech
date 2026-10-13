import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import api from "@/config/api/apiList";
import {
  setFetchedStatus,
  setNavigation,
} from "@/store/slices/navigationSlice";
import { get } from "@/lib/metadata/fetch";

const titleToSlug = (title?: string | null) =>
  title?.trim().toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-") ?? "";

const normalizeMenuItems = (items: IMenuItem[] = []): IMenuItem[] =>
  items.map((item) => ({
    ...item,
    slug: item.slug ?? titleToSlug(item.title),
    children: item.children ? normalizeMenuItems(item.children) : undefined,
  }));

export const normalizeSiteInfoNavigation = (data: any): INavigationSchema => {
  const navigationItems = normalizeMenuItems(data?.navigation ?? []);

  return {
    header: {
      name: "Header",
      slug: "header",
      items: normalizeMenuItems(data?.header_navigation ?? navigationItems),
    },
    footer: {
      name: "Footer",
      slug: "footer",
      items: normalizeMenuItems(data?.footer_navigation ?? navigationItems),
    },
    settings: {
      name: "Settings",
      slug: "settings",
      items: data?.settings ? [data.settings] : [],
    },
    socialLinks: {
      name: "Social Links",
      slug: "social_Links",
      items: data?.socials ?? data?.social_links ?? [],
    },
  };
};

export default function useNavigationData() {
  const { dataFetched, header, footer, settings, socialLinks } = useAppSelector(
    (state) => state.navigation,
  );
  const dispatch = useAppDispatch();

  const getNavigationData = async () => {
    try {
      const response = (await get(api.siteInfo)) as any;

      const data = response?.data?.data;

      dispatch(setNavigation(normalizeSiteInfoNavigation(data)));

      dispatch(setFetchedStatus(true));
    } catch (err) {
      console.error("Navigation fetch error:", err);
    }
  };

  useEffect(() => {
    if (!dataFetched) {
      getNavigationData();
    }
  }, [dataFetched]);

  return {
    navigation: { header, footer, settings, socialLinks },
    getNavigationData,
  };
}
