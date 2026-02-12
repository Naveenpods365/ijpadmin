import api from "../lib/axios";

// ── Types ──────────────────────────────────────────────────────────────
export interface UserOverview {
    totalUsers: number;
    totalVendors: number;
}

export interface ReportByRegion {
    region: string;
    count: number;
}

export interface RecentActivity {
    type: string;
    id: string;
    data: {
        adminId?: string;
        actionType?: string;
        targetType?: string;
        targetId?: string;
        title?: string;
    };
    timestamp: string;
}

export interface DashboardOverviewResponse {
    success: boolean;
    data: {
        userOverview: UserOverview;
        revenueSource: unknown[];
        reportsByRegion: ReportByRegion[];
        recentActivity: RecentActivity[];
    };
}

// ── Charts types ───────────────────────────────────────────────────────
export interface ChartPeriod {
    startDate: string;
    endDate: string;
    totalDays: number;
    label: string;
}

export interface SalesRevenuePoint {
    label: string;
    revenue: number;
}

export interface DailyActiveUsersPoint {
    label: string;
    users: number;
}

export interface DashboardChartsResponse {
    success: boolean;
    data: {
        period: ChartPeriod;
        salesRevenue: SalesRevenuePoint[];
        dailyActiveUsers: DailyActiveUsersPoint[];
    };
}

// ── Dashboard Service ──────────────────────────────────────────────────
export const dashboardService = {
    /**
     * GET /admin/dashboard/overview
     */
    getOverview: async (): Promise<DashboardOverviewResponse> => {
        const { data } = await api.get<DashboardOverviewResponse>(
            "/admin/dashboard/overview",
        );
        return data;
    },

    /**
     * GET /admin/dashboard/charts
     */
    getCharts: async (): Promise<DashboardChartsResponse> => {
        const { data } = await api.get<DashboardChartsResponse>(
            "/admin/dashboard/charts",
        );
        return data;
    },
};

