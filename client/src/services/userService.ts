import api from "../lib/axios";

// ── Types ──────────────────────────────────────────────────────────────

export interface NotificationPreferences {
    channels: {
        email: boolean;
        push: boolean;
        text: boolean;
    };
    triggers: {
        likes: boolean;
        dislikes: boolean;
        comments: boolean;
        flags: boolean;
        newFollower: boolean;
        newPostFromFollowing: boolean;
    };
    blackoutWindow: {
        start: string;
        end: string;
    };
}

export interface UserAccount {
    _id: string;
    authId: string;
    email: string;
    mobileNumber?: string;
    firstName?: string;
    lastName?: string;
    username?: string | null;
    reservedUsernames?: string[];
    usernameEditCount?: number;
    isUsernameSet?: boolean;
    about?: string | null;
    zipCode?: string;
    isLocationEnabled?: boolean;
    interests?: string[];
    partnerInterests?: string[];
    isActive: boolean;
    specialEvents?: any[];
    notificationPreferences?: NotificationPreferences;
    createdAt: string;
    updatedAt: string;
    accountStatus?: string;
    isBlocked?: boolean;
    accountType: "USER" | "VENDOR";
    // Vendor specific fields
    businessName?: string | null;
    registeredAddress?: string | null;
    businessType?: string;
    isBizTagged?: boolean;
    isVerified?: boolean;
    rating?: number;
    totalReviews?: number;
    totalSales?: number;
    categories?: string[];
    isVendorDetailUpdated?: boolean;
    avatarKey?: string;
    manualLocation?: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface UsersListResponse {
    success: boolean;
    data: {
        accounts: UserAccount[];
        pagination: Pagination;
    };
}

export interface UserDetailResponse {
    success: boolean;
    message: string;
    data: UserAccount;
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
        accountType?: string; // "USER" | "VENDOR"
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
};

