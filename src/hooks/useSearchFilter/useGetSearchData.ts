import { useCallback, useState } from "react";
import useHTTP from "../useHTTP";
import api from "@/config/api/apiList";

type SearchResult = {
  items: any[];
  nextPageUrl?: string;
};

export const useGetSearchData = () => {
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadMoreUrl, setLoadMoreUrl] = useState<string | null>(null);

  const { GetData } = useHTTP();

  const extractSearchData = (response: any) => {
    const serverData = response?.data?.data;

    const items = Array.isArray(serverData?.data?.data)
      ? serverData.data.data
      : Array.isArray(serverData?.data)
        ? serverData.data
        : Array.isArray(serverData)
          ? serverData
          : [];

    const nextPageUrl =
      serverData?.data?.next_page_url || serverData?.links?.next || null;

    return { items, nextPageUrl };
  };

  // ✅ fresh search (clears old), used for first page
  const getSearchData = useCallback(
    async (searchQuery: string) => {
      const query = searchQuery.trim();

      setIsLoading(true);
      setSearchResult([]);
      setLoadMoreUrl(null);
      setError("");

      if (!query) {
        setIsLoading(false);
        return;
      }

      try {
        const response: any = null;
        // const response: any = await GetData({
        //   api: api.search(query),
        //   config: {
        //     headers: {
        //       "X-Brand-Token": ENV.BRAND_TOKEN || "",
        //       "X-Brand-Id": ENV.BRAND_ID || "",
        //     },
        //   },
        //   showLoader: true,
        // });

        if (response?.data) {
          const { items, nextPageUrl }: SearchResult =
            extractSearchData(response);

          if (items.length > 0) {
            setSearchResult(items);
            setLoadMoreUrl(nextPageUrl ?? null);
          } else {
            setError("No Result Found");
            setLoadMoreUrl(null);
          }
        } else {
          setError("No Result Found");
          setLoadMoreUrl(null);
        }
      } catch (err) {
        setError("No Result Found");
        setLoadMoreUrl(null);
      } finally {
        setIsLoading(false);
      }
    },
    [GetData],
  );

  // ✅ load more: appends items from nextPageUrl
  const loadMore = useCallback(async () => {
    if (!loadMoreUrl) return;

    setIsLoading(true);
    setError("");

    try {
      const response: any = await GetData({
        api: loadMoreUrl, // must support full/absolute URL in GetData
        // config: {
        //   headers: {
        //     "X-Brand-Token": ENV.BRAND_TOKEN || "",
        //     "X-Brand-Id": ENV.BRAND_ID || "",
        //   },
        // },
        showLoader: true,
      });

      if (response?.data) {
        const { items, nextPageUrl }: SearchResult =
          extractSearchData(response);

        if (items.length > 0) {
          setSearchResult((prev) => [...prev, ...items]);
        }

        setLoadMoreUrl(nextPageUrl ?? null);
      } else {
        setLoadMoreUrl(null);
      }
    } catch (err) {
      setError("Failed to load more");
    } finally {
      setIsLoading(false);
    }
  }, [GetData, loadMoreUrl]);

  const searchClose = useCallback(() => {
    setSearchResult([]);
    setError("");
    setIsLoading(false);
    setLoadMoreUrl(null);
  }, []);

  return {
    searchResult,
    setSearchResult,
    error,
    isLoading,
    loadMoreUrl,
    getSearchData,
    loadMore,
    searchClose,
  };
};
