import style from "./Style.module.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentActivities = [
    {
        title: "New post created",
        description: "John Doe created a new deal",
        time: "2 min ago",
        color: "bg-[#10b5cb]",
    },
    {
        title: "New user registered",
        description: "Jane Smith joined the platform",
        time: "2 min ago",
        color: "bg-[#62a230]",
    },
    {
        title: "Payment received",
        description: "John Doe created a new deal",
        time: "2 min ago",
        color: "bg-[#ffcc00]",
    },
    {
        title: "New post created",
        description: "John Doe created a new deal",
        time: "2 min ago",
        color: "bg-[#10b5cb]",
    },
    {
        title: "New post created",
        description: "John Doe created a new deal",
        time: "2 min ago",
        color: "bg-[#10b5cb]",
    },
];

export function RecentActivityCard() {
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
                {recentActivities.map((activity, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between px-4 py-3 bg-[#f6f8fa] rounded-xl group hover:bg-[#eef2f6] transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-2.5 h-2.5 ${activity.color} rounded-full`}
                            />
                            <div className="flex flex-col">
                                <span className="font-semibold text-[#222f36] text-sm">
                                    {activity.title}
                                </span>
                                <span className="text-[#7b848f] text-[10px]">
                                    {activity.description}
                                </span>
                            </div>
                        </div>
                        <span className="text-[#7b848f] text-[10px] whitespace-nowrap">
                            {activity.time}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
