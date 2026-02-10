import { QueryClient, QueryFunction } from "@tanstack/react-query";
import api from "./axios";

// ── Legacy fetch-based helpers (kept for backwards compatibility) ──────
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

// ── Axios-based helper for mutations ──────────────────────────────────
export async function axiosRequest<T = unknown>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: unknown,
): Promise<T> {
  const response = await api.request<T>({ method, url, data });
  return response.data;
}

// ── Default query function ────────────────────────────────────────────
type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      // Try Axios first (uses auth interceptor automatically)
      const { data } = await api.get(queryKey.join("/") as string);
      return data;
    } catch (error: any) {
      if (
        unauthorizedBehavior === "returnNull" &&
        error.response?.status === 401
      ) {
        return null;
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes (better for API data)
      retry: 1,
    },
    mutations: {
      retry: false,
    },
  },
});
