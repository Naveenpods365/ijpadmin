import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { DailyActiveUsersPoint, ChartPeriod } from "@/services/dashboardService";

interface DailyActiveUsersCardProps {
    dailyActiveUsers?: DailyActiveUsersPoint[];
    period?: ChartPeriod;
    isLoading?: boolean;
}

export function DailyActiveUsersCard({
    dailyActiveUsers,
    period,
    isLoading,
}: DailyActiveUsersCardProps) {
    // Map API data to chart format
    const chartData = (dailyActiveUsers || []).map((point) => ({
        name: point.label,
        value: point.users,
    }));

    const periodLabel = period?.label || "Last 14 days trend";

    return (
        <Card className="bg-white rounded-[10px] border border-[#efefef] shadow-[0px_1px_3px_#00000005,0px_6px_10px_#b1b1b114]">
            <CardHeader className="px-5 pt-5 pb-3 space-y-1">
                <CardTitle className="[font-family:'Poppins',Helvetica] font-semibold text-[#222f36] text-xl">
                    Daily Active Users
                </CardTitle>
                <p className="text-sm text-[#8c8c8c]">{periodLabel}</p>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0 h-[220px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-[#21c45d]" />
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-[#7b848f] text-sm">
                        No active user data available
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient
                                    id="colorDau"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#21c45d"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#21c45d"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#edf1f3"
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                                tick={{ fill: "#7b848f", fontSize: 9 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                width={34}
                                tick={{ fill: "#7b848f", fontSize: 9 }}
                            />
                            <Tooltip
                                cursor={{
                                    stroke: "#e6eaee",
                                    strokeDasharray: "4 4",
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#21c45d"
                                strokeWidth={3}
                                dot={false}
                                fillOpacity={1}
                                fill="url(#colorDau)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
