import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PlatformMetricTile({
    metric,
}: {
    metric: {
        value: string;
        label: string;
        percentage: string;
        trend: "up" | "down";
        gradient: string;
    };
}) {
    return (
        <div
            className={`${metric.gradient} relative h-[140px] rounded-xl overflow-hidden p-4 flex flex-col justify-between shadow-sm hover:scale-[1.02] transition-transform`}
        >
            <div className="relative flex items-start justify-between">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 h-6 px-2 gap-1 backdrop-blur-sm">
                    {metric.trend === "up" ? (
                        <TrendingUpIcon className="w-3 h-3" />
                    ) : (
                        <TrendingDownIcon className="w-3 h-3" />
                    )}
                    <span className="font-bold text-[10px]">
                        {metric.percentage}
                    </span>
                </Badge>
            </div>
            <div className="relative space-y-1">
                <div className="font-bold text-white text-2xl tracking-tight">
                    {metric.value}
                </div>
                <div className="font-medium text-white/80 text-[11px] uppercase tracking-wider">
                    {metric.label}
                </div>
            </div>
        </div>
    );
}
