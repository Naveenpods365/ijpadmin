import axios from "axios";
import { scheduleRefresh, stopRefresh } from "./tokenRefresh";

// ── Base Axios Instance ────────────────────────────────────────────────
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://124.123.18.19:3006/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// ── Token helpers ──────────────────────────────────────────────────────
export const getAccessToken = (): string | null =>
    localStorage.getItem("accessToken");

export const getRefreshToken = (): string | null =>
    localStorage.getItem("refreshToken");

export const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("auth");
    localStorage.removeItem("adminUser");
};

// ── Request interceptor: attach Bearer token ───────────────────────────
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// ── Response interceptor: handle 401 & token refresh ───────────────────
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const requestUrl = originalRequest?.url || "";

        // Skip token refresh for auth endpoints (login, register, etc.)
        // These return 401 for invalid credentials — not expired tokens
        const isAuthEndpoint =
            requestUrl.includes("/auth/login") ||
            requestUrl.includes("/auth/register") ||
            requestUrl.includes("/auth/refresh-token");

        // If 401 and not already retrying and not an auth endpoint
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isAuthEndpoint
        ) {
            // If already refreshing, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = getRefreshToken();

            if (!refreshToken) {
                // No refresh token – force logout
                stopRefresh();
                clearTokens();
                window.location.href = "/login";
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post(
                    `${API_BASE_URL}/auth/refresh-token`,
                    { refreshToken },
                );

                const newAccessToken = data.data?.accessToken || data.accessToken;
                const newRefreshToken =
                    data.data?.refreshToken || data.refreshToken || refreshToken;

                setTokens(newAccessToken, newRefreshToken);
                processQueue(null, newAccessToken);

                // Re-schedule proactive refresh with the new token
                scheduleRefresh();

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                stopRefresh();
                clearTokens();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export default api;
