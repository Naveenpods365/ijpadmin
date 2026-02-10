import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

// ── Query Keys ─────────────────────────────────────────────────────────
export const userKeys = {
    all: ["users"] as const,
    lists: () => [...userKeys.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
        [...userKeys.lists(), filters] as const,
    details: () => [...userKeys.all, "detail"] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
    search: (query: string) => [...userKeys.all, "search", query] as const,
};

/**
 * Hook: useUsers
 * GET /admin/users — list with pagination and optional filters
 */
export function useUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sort?: string;
}) {
    return useQuery({
        queryKey: userKeys.list(params || {}),
        queryFn: () => userService.listUsers(params),
    });
}

/**
 * Hook: useUserDetail
 * GET /admin/users/:id — single user details
 */
export function useUserDetail(userId: string) {
    return useQuery({
        queryKey: userKeys.detail(userId),
        queryFn: () => userService.getUserById(userId),
        enabled: !!userId,
    });
}

/**
 * Hook: useBlockUser
 * PATCH /admin/users/:id/block
 */
export function useBlockUser() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (userId: string) => userService.blockUser(userId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            toast({
                title: "User Blocked",
                description: data.message || "User has been blocked.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Block Failed",
                description:
                    error.response?.data?.message || "Could not block user.",
                variant: "destructive",
            });
        },
    });
}

/**
 * Hook: useUnblockUser
 * PATCH /admin/users/:id/unblock
 */
export function useUnblockUser() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (userId: string) => userService.unblockUser(userId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            toast({
                title: "User Unblocked",
                description: data.message || "User has been unblocked.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Unblock Failed",
                description:
                    error.response?.data?.message || "Could not unblock user.",
                variant: "destructive",
            });
        },
    });
}

/**
 * Hook: useSearchUsers
 * GET /admin/users/search?q=...
 */
export function useSearchUsers(query: string) {
    return useQuery({
        queryKey: userKeys.search(query),
        queryFn: () => userService.searchUsers(query),
        enabled: query.trim().length > 0,
    });
}
