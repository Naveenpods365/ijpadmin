import api from "../lib/axios";

// ── Types ──────────────────────────────────────────────────────────────

export interface PostEngagement {
    likes: number;
    comments: number;
    views: number;
}

export interface PostAuthorDetails {
    name: string;
    avatar: string;
}

export interface Post {
    _id: string;
    authorId: string;
    authorDetails: PostAuthorDetails;
    title: string;
    description?: string;
    thumbnail: string;
    images?: string[];
    type: "Regular" | "Sponsored" | "Group Buy";
    category: string;
    subCategory: string;
    dealStartDate: string;
    dealEndDate?: string;
    onSale?: boolean;
    saleType?: string;
    originalPrice?: number;
    purchasePrice?: number;
    websiteUrl?: string;
    datePurchased?: string;
    engagement: PostEngagement;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface PostsPagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface PostsListResponse {
    success: boolean;
    data: {
        posts: Post[];
        pagination: PostsPagination;
    };
}

export interface PostDetailResponse {
    success: boolean;
    message: string;
    data: Post;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
}

// ── Post Service ───────────────────────────────────────────────────────
export const postService = {
    /**
     * GET /admin/posts — List all posts
     */
    listPosts: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        category?: string;
        type?: string;
    }): Promise<PostsListResponse> => {
        const { data } = await api.get<PostsListResponse>("/admin/posts", {
            params,
        });
        return data;
    },

    /**
     * GET /admin/posts/:id — Get a post by ID
     */
    getPostById: async (postId: string): Promise<PostDetailResponse> => {
        const { data } = await api.get<PostDetailResponse>(
            `/admin/posts/${postId}`,
        );
        return data;
    },

    /**
     * POST /admin/posts — Create a new post
     */
    createPost: async (
        payload: Partial<Post>,
    ): Promise<PostDetailResponse> => {
        const { data } = await api.post<PostDetailResponse>(
            "/admin/posts",
            payload,
        );
        return data;
    },

    /**
     * PUT /admin/posts/:id — Update a post
     */
    updatePost: async (
        postId: string,
        payload: Partial<Post>,
    ): Promise<PostDetailResponse> => {
        const { data } = await api.put<PostDetailResponse>(
            `/admin/posts/${postId}`,
            payload,
        );
        return data;
    },

    /**
     * DELETE /admin/posts/:id — Delete a post
     */
    deletePost: async (postId: string, reason?: string): Promise<ApiResponse> => {
        const { data } = await api.delete<ApiResponse>(
            `/admin/posts/${postId}`,
            { data: { reason: reason || "Deleted by admin" } },
        );
        return data;
    },

    /**
     * GET /admin/posts/search — Search posts
     */
    searchPosts: async (query: string): Promise<PostsListResponse> => {
        const { data } = await api.get<PostsListResponse>(
            "/admin/posts/search",
            {
                params: { q: query },
            },
        );
        return data;
    },
};
