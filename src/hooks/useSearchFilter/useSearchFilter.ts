"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useHTTP from "@/hooks/useHTTP";
import api from "@/config/api/apiList";
import routes from "@/config/routes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  searchResultInitialState,
  setLoadMoreUrl,
  setQuery,
  setSearchResultsInState,
} from "@/store/slices/searchResultSlice";
import useDebounceHandler from "./useDebounceHandler";


type SearchItem = {
  type?: string;
  slug?: string;
  [key: string]: any;
};

export const useSearchFilter = () => {
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { GetData } = useHTTP();
  const dispatch = useAppDispatch();

  const { query, searchResult, loadMoreUrl, keyWord } = useAppSelector(
    (state) => state.searchResult,
  );

  // Run search API
  const runSearch = async (searchQuery: string) => {
    setIsDebouncing(false);
    setIsLoading(true);
    dispatch(setSearchResultsInState({ searchResult: [] }));
    setError("");
    setShowError(false);
    if (searchQuery.trim().length === 0) {
      setIsLoading(false);
      return;
    }

    try {

      const response: any = null; 
      // const response: any = await GetData({
      //   api: api.search(searchQuery ?? " "),
      //   config: {
      //     headers: {
      //       "X-Brand-Token": ENV.BRAND_TOKEN || "",
      //       "X-Brand-Id": ENV.BRAND_ID || "",
      //     },
      //   },
      //   showLoader: true,
      // });

      if (response?.data) {
        const { items, nextPageUrl } = extractSearchData(response);
        dispatch(
          setSearchResultsInState({
            searchResult: items,
            keyWord: searchQuery,
          }),
        );
        dispatch(setLoadMoreUrl(nextPageUrl));
      } else {
        setError("No Result Found");
        setShowError(true);
      }
    } catch {
      setError("No Result Found");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract & normalize search response
  const extractSearchData = (response: any) => {
    return {
      items: Array.isArray(response?.data?.data?.data)
        ? response?.data?.data?.data
        : [],
      nextPageUrl: response?.data?.data?.links?.next ?? null,
    };
  };

  useDebounceHandler(
    () => runSearch(query),
    [query],
    2000,
    () => setIsDebouncing(true),
    debounceRef,
  );

  const handleManualSearch = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    runSearch(query);
  };

  // On mount: check URL param
  useEffect(() => {
    const urlQuery = searchParams.get("search");
    if (urlQuery) {
      dispatch(setQuery(urlQuery));
      runSearch(urlQuery);
    }
  }, []);

  // Update URL when Redux query changes
  useEffect(() => {
    if (pathname === "/search") {
      const params = new URLSearchParams(searchParams.toString());
      if (keyWord.trim()) {
        params.set("search", keyWord);
      } else {
        params.delete("search");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [keyWord, pathname]);

  // useEffect(() => {
  //   setError((prevState) => {
  //     if (prevState.trim().length) {
  //       return  "No Result Found";
  //     }
  //     return prevState;
  //   });
  // }, []);

  // Load more results
  const getNextPageData = async () => {
    if (!loadMoreUrl || loadingMore) return;
    setLoadingMore(true);

    try {
      const response = await GetData({ api: loadMoreUrl });
      const { items, nextPageUrl } = extractSearchData(response);
      dispatch(
        setSearchResultsInState({
          searchResult: [...searchResult, ...items],
        }),
      );
      dispatch(setLoadMoreUrl(nextPageUrl));
    } finally {
      setLoadingMore(false);
    }
  };

  // Redirect based on type
  const handleRedirect = (item: SearchItem, close?: () => void) => {
    const type = item?.type?.toString()?.toLowerCase();
    const slug = item?.slug;

    if (close) close();

    // switch (type) {
    //   case "category":
    //     router.push(`${routes.product}?category=${slug}`);
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
    //     router.push(`/${slug}`);
    //     break;
    //   default:
    //     break;
    // }
  };

  const handleClear = () => {
    dispatch(setQuery(""));
    dispatch(setSearchResultsInState(searchResultInitialState));
    setError("");
    setShowError(false);
  };

  const hasAnything =
    (query && query.trim().length > 0) ||
    (Array.isArray(searchResult) && searchResult.length > 0) ||
    error.trim().length > 0;

  const showLoader = isLoading || isDebouncing;

  return {
    query,
    keyWord,
    error,
    showError,
    loadingMore,
    loadMoreUrl,
    getNextPageData,
    handleRedirect,
    handleClear,
    hasAnything,
    isLoading: showLoader,
    runSearch,
    handleManualSearch,
  };
};
