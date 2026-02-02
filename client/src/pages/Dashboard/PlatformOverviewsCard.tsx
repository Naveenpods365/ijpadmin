import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformMetricTile } from "./PlatformMetricTile";

const platformMetrics = [
    {
        value: "$168K",
        label: "Ads Revenue (MTD)",
        percentage: "15%",
        trend: "up" as const,
        gradient: "bg-gradient-to-br from-orange-400 to-orange-600",
    },
    {
        value: "3.8M",
        label: "Total Posts",
        percentage: "5%",
        trend: "up" as const,
        gradient: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    },
    {
        value: "$314K",
        label: "Subscriptions Revenue",
        percentage: "9%",
        trend: "up" as const,
        gradient: "bg-gradient-to-br from-purple-500 to-purple-700",
    },
    {
        value: "27",
        label: "Fraud Alerts",
        percentage: "23%",
        trend: "down" as const,
        gradient: "bg-gradient-to-br from-red-500 to-red-700",
    },
];

export function PlatformOverviewsCard() {
    return (
        <Card className="w-full xl:w-[478px] bg-white rounded-xl border border-solid border-[#e0ebe5]">
            <CardHeader className="space-y-1 pb-6">
                <CardTitle className="font-semibold text-[#222f36] text-xl">
                    Platform Overviews
                </CardTitle>
                <p className="text-[#8c8c8c] text-sm">
                    Performance metrics overview
                </p>
            </CardHeader>
            <CardContent className="space-y-4 mt-[2rem]">
                <div className="grid grid-cols-2 gap-4">
                    {platformMetrics.map((metric, index) => (
                        <PlatformMetricTile key={index} metric={metric} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
