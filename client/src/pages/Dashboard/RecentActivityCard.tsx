import style from "./Style.module.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { RecentActivity } from "@/services/dashboardService";

interface RecentActivityCardProps {
    activities?: RecentActivity[];
    isLoading?: boolean;
}

// Map activity types to display info
const getActivityDisplay = (activity: RecentActivity) => {
    const actionType = activity.data?.actionType || activity.type;

    const displayMap: Record<string, { title: string; color: string; description: string }> = {
        UPDATE_POST_STATUS: {
            title: "Post Status Updated",
            color: "bg-[#f59f0a]",
            description: `Updated status of ${activity.data?.targetType || "item"}`,
        },
        DELETE_POST: {
            title: "Post Deleted",
            color: "bg-[#ef4343]",
            description: `Deleted ${activity.data?.targetType || "item"}`,
        },
        NEW_POST: {
            title: "New Post Created",
            color: "bg-[#10b5cb]",
            description: activity.data?.title
                ? `"${activity.data.title}" was published`
                : "A new post was created",
        },
        ADMIN_ACTION: {
            title: "Admin Action",
            color: "bg-[#62a230]",
            description: `Action on ${activity.data?.targetType || "item"}`,
        },
        NEW_USER: {
            title: "New User Registered",
            color: "bg-[#62a230]",
            description: "A new user joined the platform",
        },
    };

    return (
        displayMap[actionType] ||
        displayMap[activity.type] || {
            title: activity.type.replace(/_/g, " "),
            color: "bg-[#9ca3af]",
            description: "Activity recorded",
        }
    );
};

const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export function RecentActivityCard({ activities, isLoading }: RecentActivityCardProps) {
    return (
        <Card className="bg-white rounded-[12px] border border-[#efefef] shadow-[0px_1px_3px_#00000005,0px_6px_10px_#b1b1b114]">
            <CardHeader className="pb-2">
                <CardTitle
                    className={`${style.textCard} [font-family:'Poppins',Helvetica] font-semibold text-[#222f36] text-xl`}
                >
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[200px]">
                        <Loader2 className="h-8 w-8 animate-spin text-[#62a230]" />
                    </div>
                ) : !activities || activities.length === 0 ? (
                    <div className="flex items-center justify-center h-[200px] text-[#7b848f] text-sm">
                        No recent activity
                    </div>
                ) : (
                    activities.map((activity) => {
                        const display = getActivityDisplay(activity);
                        return (
                            <div
                                key={activity.id}
                                className="flex items-center justify-between px-4 py-3 bg-[#f6f8fa] rounded-xl group hover:bg-[#eef2f6] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-2.5 h-2.5 ${display.color} rounded-full`}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-[#222f36] text-sm">
                                            {display.title}
                                        </span>
                                        <span className="text-[#7b848f] text-[10px]">
                                            {display.description}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[#7b848f] text-[10px] whitespace-nowrap">
                                    {getRelativeTime(activity.timestamp)}
                                </span>
                            </div>
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
}
