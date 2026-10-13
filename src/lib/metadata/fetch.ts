export interface FetchOptions extends RequestInit {
  next?: {
    revalidate?: number;
  };
}

export interface RetryOptions {
  retries?: number;
  delay?: number;
  timeout?: number;
}
export class FetchError extends Error {
  constructor(
    message: string,
    public readonly attempt?: number,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "FetchError";
  }
}

type ApiResponse<T> = {
  data: T | null;
  status: number;
  error: boolean;
  message?: string;
};

export const get = async <T>(
  url: string,
  cacheType?: FetchOptions,
  options: RetryOptions = { retries: 3, delay: 2000, timeout: 10000 },
): Promise<ApiResponse<T>> => {
  const { retries = 3, delay = 2000, timeout = 10000 } = options;

  // No backend configured (empty NEXT_PUBLIC_BACKEND_URL): skip the request
  // instead of retrying a relative URL that can never resolve on the server.
  if (!/^https?:\/\//i.test(url)) {
    return {
      data: null,
      status: 0,
      error: true,
      message: `Invalid API URL: ${url}`,
    };
  }

  const fetchWithTimeout = async (
    url: string,
    fetchOptions: FetchOptions,
    timeout: number,
  ): Promise<Response> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timer);
    }
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const fetchOptions: FetchOptions = cacheType
        ? cacheType
        : { next: { revalidate: 120 } };

      const res = await fetchWithTimeout(url, fetchOptions, timeout);

      if (!res.ok) {
        if (res.status === 404) {
          return {
            data: null,
            status: 404,
            error: true,
            message: "Not Found",
          };
        }

        throw new FetchError(
          `Fetch error: ${res.statusText}`,
          attempt,
          res.status,
        );
      }

      const data = (await res.json()) as T;

      return {
        data,
        status: res.status,
        error: false,
      };
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed: ${error.message}, url: ${url}`);

      if (attempt < retries) {
        const backoffDelay = delay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      } else {
        return {
          data: null,
          status: error?.status || 500,
          error: true,
          message:
            error?.message || "Max retries reached. Could not fetch the data.",
        };
      }
    }
  }

  return {
    data: null,
    status: 500,
    error: true,
    message: "Unexpected error",
  };
};

export const brandGet = async <T>(
  url: string,
  cacheType?: FetchOptions,
  options: RetryOptions = { retries: 3, delay: 2000, timeout: 10000 },
): Promise<ApiResponse<T>> => {
  const baseCache: FetchOptions = cacheType
    ? cacheType
    : { next: { revalidate: 120 } };

  const fetchOptions: FetchOptions = {
    ...baseCache,
    // headers: {
    //   ...(baseCache as any)?.headers,
    //   "X-Brand-Token": ENV.BRAND_TOKEN!,
    //   "X-Brand-Id": ENV.BRAND_ID!,
    // },
  };

  return get<T>(url, fetchOptions, options);
};
