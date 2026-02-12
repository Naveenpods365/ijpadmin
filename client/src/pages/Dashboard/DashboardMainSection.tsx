import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";
import { useDashboardOverview, useDashboardCharts } from "@/hooks/useDashboard";
import { DashboardHeader } from "./DashboardHeader";
import { StatsCardsRow } from "./StatsCardsRow";
import { SalesRevenueCard } from "./SalesRevenueCard";
import { RecentActivityCard } from "./RecentActivityCard";
import { UserOverviewCard } from "./UserOverviewCard";
import { DailyActiveUsersCard } from "./DailyActiveUsersCard";
import { RevenueSourcesCard } from "./RevenueSourcesCard";
import { ReportsByRegionCard } from "./ReportsByRegionCard";

export const DashboardMainSection = (): JSX.Element => {
    const { toast } = useToast();
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2025, 9, 2),
        to: new Date(2025, 9, 18),
    });

    // ── Fetch dashboard data from API ──────────────────────────────
    const { data: overview, isLoading } = useDashboardOverview();
    const dashboardData = overview?.data;

    const { data: chartsResponse, isLoading: isChartsLoading } = useDashboardCharts();
    const chartsData = chartsResponse?.data;

    const handleSearch = (query: string) => {
        toast({
            title: "Search initiated",
            description: `Searching for: ${query}`,
        });
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <DashboardHeader onSearch={handleSearch} />

            <StatsCardsRow />

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px_400px] gap-4 w-full">
                <SalesRevenueCard
                    date={date}
                    onDateChange={setDate}
                    salesRevenue={chartsData?.salesRevenue}
                    isLoading={isChartsLoading}
                />
                <RecentActivityCard
                    activities={dashboardData?.recentActivity}
                    isLoading={isLoading}
                />
                <UserOverviewCard
                    userOverview={dashboardData?.userOverview}
                    isLoading={isLoading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                <DailyActiveUsersCard
                    dailyActiveUsers={chartsData?.dailyActiveUsers}
                    period={chartsData?.period}
                    isLoading={isChartsLoading}
                />
                <RevenueSourcesCard
                    revenueSource={dashboardData?.revenueSource}
                    isLoading={isLoading}
                />
                <ReportsByRegionCard
                    regions={dashboardData?.reportsByRegion}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

