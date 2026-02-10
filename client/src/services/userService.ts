import api from "../lib/axios";

// ── Types ──────────────────────────────────────────────────────────────
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    registeredAt: string;
    activity: "High" | "Medium" | "Low";
    reports: string;
    status: "Active" | "Inactive" | "Suspended";
    profileCompletion: number;
    avatar?: string;
}

export interface UsersListResponse {
    success: boolean;
    message: string;
    data: {
        users: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface UserDetailResponse {
    success: boolean;
    message: string;
    data: User;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
}

// ── Users Service ──────────────────────────────────────────────────────
export const userService = {
    /**
     * GET /admin/users — List all users
     */
    listUsers: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        sort?: string;
    }): Promise<UsersListResponse> => {
        const { data } = await api.get<UsersListResponse>("/admin/users", {
            params,
        });
        return data;
    },

    /**
     * GET /admin/users/:id — Get user details
     */
    getUserById: async (userId: string): Promise<UserDetailResponse> => {
        const { data } = await api.get<UserDetailResponse>(
            `/admin/users/${userId}`,
        );
        return data;
    },

    /**
     * PATCH /admin/users/:id/block — Block a user
     */
    blockUser: async (userId: string): Promise<ApiResponse> => {
        const { data } = await api.patch<ApiResponse>(
            `/admin/users/${userId}/block`,
        );
        return data;
    },

    /**
     * PATCH /admin/users/:id/unblock — Unblock a user
     */
    unblockUser: async (userId: string): Promise<ApiResponse> => {
        const { data } = await api.patch<ApiResponse>(
            `/admin/users/${userId}/unblock`,
        );
        return data;
    },

    /**
     * GET /admin/users/search — Search users
     */
    searchUsers: async (query: string): Promise<UsersListResponse> => {
        const { data } = await api.get<UsersListResponse>(
            "/admin/users/search",
            {
                params: { q: query },
            },
        );
        return data;
    },
};
