import axios from "axios";
import { attachTokenRefreshInterceptor } from "./tokenRefresh";

/* ================= TOKEN SERVICE ================= */
let accessToken: string | null = null;

export const setAccessToken = (token: string, refreshToken: string | null = null) => {
    accessToken = token;
    if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
    }
};

// Alias for backward compatibility
export const setTokens = setAccessToken;

export const getAccessToken = () => accessToken;

export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const clearTokens = () => {
    accessToken = null;
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("auth"); // Also clear auth flag if used
    localStorage.removeItem("adminUser");
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://124.123.18.19:3006/api";

export const refreshOnLoad = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return;

    try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
        // The user snippet uses res.data.data.accessToken
        // Assuming the response structure is { success: true, data: { accessToken: "...", ... } }
        const newAccessToken = res.data.data?.accessToken || res.data.accessToken;
        const newRefreshToken = res.data.data?.refreshToken || res.data.refreshToken;
        
        setAccessToken(newAccessToken, newRefreshToken);
        return newAccessToken;
    } catch (error) {
        clearTokens();
    }
};

/* ================= AXIOS INSTANCE ================= */
const authInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

/* ================= REQUEST INTERCEPTOR ================= */
authInstance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

/* ================= RESPONSE INTERCEPTOR ================= */
attachTokenRefreshInterceptor(authInstance, setAccessToken, clearTokens);

export default authInstance;

