import api from "../lib/axios";

// ── Types ──────────────────────────────────────────────────────────────
export interface Post {
    id: string;
    title: string;
    content: string;
    author: string;
    category: string;
    status: "Published" | "Draft" | "Pending" | "Rejected";
    createdAt: string;
    updatedAt: string;
    likes: number;
    comments: number;
    image?: string;
}

export interface PostsListResponse {
    success: boolean;
    message: string;
    data: {
        posts: Post[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
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
    deletePost: async (postId: string): Promise<ApiResponse> => {
        const { data } = await api.delete<ApiResponse>(
            `/admin/posts/${postId}`,
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
