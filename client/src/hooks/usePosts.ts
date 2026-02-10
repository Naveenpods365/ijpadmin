import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/services/postService";
import type { Post } from "@/services/postService";
import { useToast } from "@/hooks/use-toast";

// ── Query Keys ─────────────────────────────────────────────────────────
export const postKeys = {
    all: ["posts"] as const,
    lists: () => [...postKeys.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
        [...postKeys.lists(), filters] as const,
    details: () => [...postKeys.all, "detail"] as const,
    detail: (id: string) => [...postKeys.details(), id] as const,
    search: (query: string) => [...postKeys.all, "search", query] as const,
};

/**
 * Hook: usePosts
 * GET /admin/posts — list with pagination and optional filters
 */
export function usePosts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
}) {
    return useQuery({
        queryKey: postKeys.list(params || {}),
        queryFn: () => postService.listPosts(params),
    });
}

/**
 * Hook: usePostDetail
 * GET /admin/posts/:id — get single post
 */
export function usePostDetail(postId: string) {
    return useQuery({
        queryKey: postKeys.detail(postId),
        queryFn: () => postService.getPostById(postId),
        enabled: !!postId,
    });
}

/**
 * Hook: useCreatePost
 * POST /admin/posts — create a new post
 */
export function useCreatePost() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (payload: Partial<Post>) =>
            postService.createPost(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: postKeys.all });
            toast({
                title: "Post Created",
                description: data.message || "Post created successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Create Failed",
                description:
                    error.response?.data?.message || "Could not create post.",
                variant: "destructive",
            });
        },
    });
}

/**
 * Hook: useUpdatePost
 * PUT /admin/posts/:id — update a post
 */
export function useUpdatePost() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({
            postId,
            payload,
        }: {
            postId: string;
            payload: Partial<Post>;
        }) => postService.updatePost(postId, payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: postKeys.all });
            toast({
                title: "Post Updated",
                description: data.message || "Post updated successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Update Failed",
                description:
                    error.response?.data?.message || "Could not update post.",
                variant: "destructive",
            });
        },
    });
}

/**
 * Hook: useDeletePost
 * DELETE /admin/posts/:id — delete a post
 */
export function useDeletePost() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (postId: string) => postService.deletePost(postId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: postKeys.all });
            toast({
                title: "Post Deleted",
                description: data.message || "Post deleted successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Delete Failed",
                description:
                    error.response?.data?.message || "Could not delete post.",
                variant: "destructive",
            });
        },
    });
}
