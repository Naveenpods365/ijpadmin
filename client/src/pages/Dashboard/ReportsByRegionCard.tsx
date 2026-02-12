import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { ReportByRegion } from "@/services/dashboardService";

interface ReportsByRegionCardProps {
    regions?: ReportByRegion[];
    isLoading?: boolean;
}

const regionBarColors = [
    "#f59f0a",
    "#62a230",
    "#ef4343",
    "#10b5cb",
    "#7c3aed",
    "#9ca3af",
];

export function ReportsByRegionCard({ regions, isLoading }: ReportsByRegionCardProps) {
    // Map API data to chart-compatible format
    const chartData = (regions || []).map((r) => ({
        name: r.region,
        value: r.count,
    }));

    return (
        <Card className="bg-white rounded-[10px] border border-[#efefef] shadow-[0px_1px_3px_#00000005,0px_6px_10px_#b1b1b114]">
            <CardHeader className="px-5 pt-5 pb-3 space-y-1">
                <CardTitle className="[font-family:'Poppins',Helvetica] font-semibold text-[#222f36] text-xl">
                    Reports by Region
                </CardTitle>
                <p className="text-sm text-[#8c8c8c]">Moderation workload</p>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0 h-[220px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-[#62a230]" />
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-[#7b848f] text-sm">
                        No region data available
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
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
                                tick={{ fill: "#7b848f", fontSize: 8 }}
                                angle={-15}
                                textAnchor="end"
                                height={42}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                width={34}
                                tick={{ fill: "#7b848f", fontSize: 9 }}
                            />
                            <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={36}>
                                {chartData.map((_, idx) => (
                                    <Cell
                                        key={`cell-${idx}`}
                                        fill={
                                            regionBarColors[
                                                idx % regionBarColors.length
                                            ]
                                        }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
