import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";

export const dashboardKeys = {
    all: ["dashboard"] as const,
    overview: () => [...dashboardKeys.all, "overview"] as const,
    charts: () => [...dashboardKeys.all, "charts"] as const,
};

/**
 * Hook: useDashboardOverview
 * GET /admin/dashboard/overview
 */
export function useDashboardOverview() {
    return useQuery({
        queryKey: dashboardKeys.overview(),
        queryFn: () => dashboardService.getOverview(),
        staleTime: 2 * 60 * 1000,
    });
}

/**
 * Hook: useDashboardCharts
 * GET /admin/dashboard/charts
 */
export function useDashboardCharts() {
    return useQuery({
        queryKey: dashboardKeys.charts(),
        queryFn: () => dashboardService.getCharts(),
        staleTime: 2 * 60 * 1000,
    });
}

