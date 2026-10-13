"use client";

// import { clearCredentials } from '@/store/slices/authSlice/authSlice';
// import { fetchWebToken } from '@/utils/helpers/getWebTokenFromWeb';
import {
  decrementActiveCallsCount,
  incrementActiveCallsCount,
} from "@/store/slices/loaderSlice";
import { getAuthTokenFromLocalStorage } from "@/utils/helpers/localStorage";
import { useAppDispatch } from "@/store/hooks";
import { useState } from "react";
import { useToast } from "./useToast";

interface HTTPBaseOptions {
  api: string;
  config?: Record<string, any>;
  showLoader?: boolean;
  showErrorAlert?: boolean;
  showSuccessAlert?: boolean;
}

interface HTTPBodyOptions extends HTTPBaseOptions {
  body?: Record<string, any>;
}

interface AuthOptions extends HTTPBodyOptions {
  type: "get" | "post";
  headers?: Record<string, string>;
}

type HTTPResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: any;
};

type RequestConfig = { headers?: Record<string, string> };

type FetchResponse<T> = { data: T; status: number; headers: Headers };

// Minimal fetch-based replacement for axios (which, with its Buffer polyfill,
// added ~21KB gzipped to every page that prefetched these routes). Keeps the
// axios contract the callers rely on: resolves to `{ data, status, headers }`,
// rejects non-2xx responses with `error.response = { data, status }`, and
// JSON-encodes plain-object bodies.
const request = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  config: RequestConfig = {},
  body?: unknown,
): Promise<FetchResponse<T>> => {
  const headers: Record<string, string> = {
    Accept: "application/json, text/plain, */*",
    ...config.headers,
  };

  let payload: BodyInit | undefined;
  if (body instanceof FormData || typeof body === "string") {
    payload = body;
  } else if (body !== undefined) {
    headers["Content-Type"] ??= "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(url, { method, headers, body: payload });
  const text = await res.text();
  let data: any = text;
  try {
    data = text ? JSON.parse(text) : text;
  } catch {
    // Not JSON - keep the raw text, as axios does.
  }

  if (!res.ok) {
    throw Object.assign(
      new Error(`Request failed with status code ${res.status}`),
      { response: { data, status: res.status, headers: res.headers } },
    );
  }

  return { data, status: res.status, headers: res.headers };
};

const http = {
  get: <T>(url: string, config?: RequestConfig) =>
    request<T>("GET", url, config),
  post: <T>(url: string, body?: unknown, config?: RequestConfig) =>
    request<T>("POST", url, config, body),
  put: <T>(url: string, body?: unknown, config?: RequestConfig) =>
    request<T>("PUT", url, config, body),
  delete: <T>(url: string, config?: RequestConfig) =>
    request<T>("DELETE", url, config),
};

export default function useHTTP() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { pushToast } = useToast();
  const errorHandler = (error: any) => {
    const message =
      error?.response?.data?.message ||
      "Something went wrong. Please try again.";
    pushToast({ message, type: "error" });
    if (error?.response?.status === 401) {
      if (error?.response?.data?.status?.toString() === "400407") {
        // fetchWebToken();
        return;
      }
      // dispatch(clearCredentials());
    }
  };

  const handleRequest = async <T>(
    fn: () => Promise<T>,
    {
      showLoader = true,
      showErrorAlert = true,
      showSuccessAlert,
    }: HTTPBaseOptions,
  ): Promise<HTTPResponse<any>> => {
    if (showLoader) dispatch(incrementActiveCallsCount());
    setIsLoading(true);
    try {
      const result = await fn();

      if (showSuccessAlert) {
        pushToast({
          //@ts-ignore
          message: result?.data?.message || "Success",
          type: "success",
        });
      }
      return { success: true, data: result };
    } catch (error) {
      if (showErrorAlert) errorHandler(error);
      return { success: false, error };
    } finally {
      if (showLoader) dispatch(decrementActiveCallsCount());
      setIsLoading(false);
    }
  };

  const GetData = async <T = any>({
    api,
    config = {},
    showLoader = false,
    showErrorAlert = false,
    showSuccessAlert = false,
  }: HTTPBaseOptions): Promise<HTTPResponse<T>> =>
    handleRequest(() => http.get<T>(api, config), {
      api,
      showLoader,
      showErrorAlert,
      showSuccessAlert,
    });

  const PostData = async <T = any>({
    api,
    body = {},
    config = {},
    showLoader = true,
    showErrorAlert = true,
    showSuccessAlert = true,
  }: HTTPBodyOptions): Promise<HTTPResponse<T>> =>
    handleRequest(() => http.post<T>(api, body, config), {
      api,
      showLoader,
      showErrorAlert,
      showSuccessAlert,
    });

  const UpdateData = async <T = any>({
    api,
    body = {},
    config = {},
    showLoader = true,
    showErrorAlert = false,
    showSuccessAlert = true,
  }: HTTPBodyOptions): Promise<HTTPResponse<T>> =>
    handleRequest(() => http.put<T>(api, body, config), {
      api,
      showLoader,
      showErrorAlert,
      showSuccessAlert,
    });

  const DeleteData = async <T = any>({
    api,
    config = {},
    showLoader = true,
    showErrorAlert = false,
    showSuccessAlert = true,
  }: HTTPBaseOptions): Promise<HTTPResponse<T>> =>
    handleRequest(() => http.delete<T>(api, config), {
      api,
      showLoader,
      showErrorAlert,
      showSuccessAlert,
    });

  const AuthData = async <T = any>({
    api,
    type,
    body = {},
    headers = {},
    showLoader = true,
    showErrorAlert = true,
    showSuccessAlert = false,
  }: AuthOptions): Promise<HTTPResponse<T>> => {
    const AuthToken = getAuthTokenFromLocalStorage();
    const config = {
      headers: {
        Authorization: `Bearer ${AuthToken}`,
        ...headers,
      },
    };

    if (type === "post") {
      return await PostData({
        api,
        body,
        config,
        showErrorAlert,
        showLoader,
        showSuccessAlert,
      });
    }

    return await GetData({
      api,
      config,
      showErrorAlert,
      showLoader,
      showSuccessAlert,
    });
  };

  return {
    AuthData,
    GetData,
    PostData,
    UpdateData,
    DeleteData,
    isLoading,
  };
}
