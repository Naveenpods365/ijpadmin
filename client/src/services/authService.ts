import api, { setTokens, clearTokens } from "../lib/axios";

// ── Types ──────────────────────────────────────────────────────────────
export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        admin?: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    };
}

export interface RegisterAdminPayload {
    name: string;
    email: string;
    password: string;
    role?: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
}

// ── Auth Service ───────────────────────────────────────────────────────
export const authService = {
    /**
     * POST /admin/auth/login
     */
    login: async (payload: LoginPayload): Promise<LoginResponse> => {
        const { data } = await api.post<LoginResponse>(
            "/admin/auth/login",
            payload,
        );

        // Store tokens on successful login
        if (data.success && data.data) {
            setTokens(data.data.accessToken, data.data.refreshToken);
            localStorage.setItem("auth", "true");

            if (data.data.admin) {
                localStorage.setItem(
                    "adminUser",
                    JSON.stringify(data.data.admin),
                );
            }
        }

        return data;
    },

    /**
     * POST /admin/auth/register
     */
    registerAdmin: async (
        payload: RegisterAdminPayload,
    ): Promise<ApiResponse> => {
        const { data } = await api.post<ApiResponse>(
            "/admin/auth/register",
            payload,
        );
        return data;
    },

    /**
     * Logout – clear all tokens and auth state
     */
    logout: () => {
        clearTokens();
        window.location.href = "/login";
    },
};
