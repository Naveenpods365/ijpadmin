import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService, LoginPayload } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook: useLogin
 * Calls POST /admin/auth/login and stores tokens on success
 */
export function useLogin() {
    const { toast } = useToast();

    return useMutation({
        mutationFn: (payload: LoginPayload) => authService.login(payload),
        onSuccess: (data) => {
            toast({
                title: "Login Successful",
                description: data.message || "Welcome back!",
            });
        },
        onError: (error: any) => {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Login failed. Please try again.";
            toast({
                title: "Login Failed",
                description: message,
                variant: "destructive",
            });
        },
    });
}

/**
 * Hook: useRegisterAdmin
 * Calls POST /admin/auth/register
 */
export function useRegisterAdmin() {
    const { toast } = useToast();

    return useMutation({
        mutationFn: (payload: {
            name: string;
            email: string;
            password: string;
            role?: string;
        }) => authService.registerAdmin(payload),
        onSuccess: (data) => {
            toast({
                title: "Admin Registered",
                description: data.message || "New admin created successfully.",
            });
        },
        onError: (error: any) => {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Registration failed.";
            toast({
                title: "Registration Failed",
                description: message,
                variant: "destructive",
            });
        },
    });
}

/**
 * Hook: useLogout
 * Clears tokens and redirects to /login
 */
export function useLogout() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.clear();
        authService.logout();
    };
}
