import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    console.log(`[TokenRefresh] Processing queue with ${error ? "error" : "success"}. Queue size: ${failedQueue.length}`);

    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token as string);
    });

    failedQueue = [];
};

export const attachTokenRefreshInterceptor = (
    instance: AxiosInstance,
    setAccessToken: (token: string, refreshToken: string | null) => void,
    clearTokens: () => void
) => {
    instance.interceptors.response.use(
        (response) => response,

        async (error: AxiosError) => {
            const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

            if (!originalRequest || !error.response) {
                return Promise.reject(error);
            }

            // ================== HANDLE 401 ==================
            if (error.response.status === 401 && !originalRequest._retry) {
                console.log("[TokenRefresh] 401 on:", originalRequest.url);

                // 🔁 If refresh already running → queue this request
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return instance(originalRequest); // ✅ returned to thunk
                    });
                }

                // 🚀 Start refresh cycle
                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const refreshToken = localStorage.getItem("refreshToken");

                    if (!refreshToken) {
                        throw new Error("No refresh token");
                    }

                    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://124.123.18.19:3006/api";
                    const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });

                    const newAccessToken = res.data.data.accessToken;
                    const newRefreshToken = res.data.data.refreshToken;

                    console.log("[TokenRefresh] Token refreshed");

                    setAccessToken(newAccessToken, newRefreshToken);

                    // Release queued requests
                    processQueue(null, newAccessToken);

                    // Retry original request
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    }

                    return instance(originalRequest); // ✅ THIS resolves thunk
                } catch (err) {
                    console.error("[TokenRefresh] Refresh failed:", err);

                    processQueue(err, null);
                    clearTokens();

                    if (typeof window !== "undefined") {
                        window.location.href = "/login";
                    }

                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        },
    );
};

