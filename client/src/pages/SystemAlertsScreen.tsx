import { useState } from "react";
import {
    AlertTriangle,
    Bell,
    CheckCircle2,
    Search,
    Settings,
    X,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const alerts = [
    {
        title: "Payment Gateway Latency",
        description:
            "Stripe API response time increased by 340%. Investigating...",
        time: "2 min ago",
        status: "Critical",
        acknowledged: false,
        accent: "border-[#ef4444]",
        iconBg: "bg-[#ef4444]",
    },
    {
        title: "Fraud Spike Detected",
        description: "42% increase in flagged transactions from APAC region",
        time: "15 min ago",
        status: "Critical",
        acknowledged: false,
        accent: "border-[#ef4444]",
        iconBg: "bg-[#ef4444]",
    },
    {
        title: "Report Volume Surge",
        description: "Report submissions 2.3x higher than usual for this hour",
        time: "28 min ago",
        status: "Warning",
        acknowledged: true,
        accent: "border-[#f59f0a]",
        iconBg: "bg-[#f59f0a]",
    },
    {
        title: "AI Model Anomaly",
        description:
            "Fraud detection model confidence dropped below threshold",
        time: "45 min ago",
        status: "Warning",
        acknowledged: true,
        accent: "border-[#f59f0a]",
        iconBg: "bg-[#f59f0a]",
    },
    {
        title: "Scheduled Maintenance",
        description: "Database maintenance window scheduled for 02:00 UTC",
        time: "1 hour ago",
        status: "Info",
        acknowledged: true,
        accent: "border-[#0ea5e9]",
        iconBg: "bg-[#0ea5e9]",
    },
    {
        title: "Scheduled Maintenance",
        description: "Database maintenance window scheduled for 02:00 UTC",
        time: "1 hour ago",
        status: "Info",
        acknowledged: true,
        accent: "border-[#0ea5e9]",
        iconBg: "bg-[#0ea5e9]",
    },
] as const;

const statusStyles: Record<
    "Critical" | "Warning" | "Info",
    { bg: string; text: string }
> = {
    Critical: { bg: "bg-[#ef4444]", text: "text-white" },
    Warning: { bg: "bg-[#f59f0a]", text: "text-white" },
    Info: { bg: "bg-[#0ea5e9]", text: "text-white" },
};

export function SystemAlertsScreen() {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<
        "All" | "Critical" | "Warning" | "Info"
    >("All");

    const alertCounts = alerts.reduce(
        (acc, alert) => {
            acc.All += 1;
            acc[alert.status] += 1;
            return acc;
        },
        { All: 0, Critical: 0, Warning: 0, Info: 0 },
    );

    const filteredAlerts = alerts.filter((alert) => {
        if (activeTab === "All") return true;
        return alert.status === activeTab;
    });

    const alertTabs = [
        { label: "All" as const, count: alertCounts.All },
        { label: "Critical" as const, count: alertCounts.Critical },
        { label: "Warning" as const, count: alertCounts.Warning },
        { label: "Info" as const, count: alertCounts.Info },
    ];

    return (
        <div className="min-h-screen bg-[#f3f5f6]">
            <div className="hidden lg:block fixed inset-y-0 left-0 w-[312px] z-40">
                <Sidebar className="w-[280px]" variant="desktop" />
            </div>

            <main className="min-h-screen overflow-y-auto no-scrollbar lg:pl-[292px]">
                <div className="px-4 pt-6 pb-10 lg:px-8">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="h-10 w-10 p-0 rounded-[6px] bg-white border border-[#edf1f3]"
                                    >
                                        <span className="sr-only">Open menu</span>
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5 text-[#7b848f]"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="3" y1="12" x2="21" y2="12" />
                                            <line x1="3" y1="6" x2="21" y2="6" />
                                            <line x1="3" y1="18" x2="21" y2="18" />
                                        </svg>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="p-0 bg-transparent border-0"
                                >
                                    <Sidebar className="w-[280px]" variant="drawer" />
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-[20px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                    System Alerts
                                </h1>
                                <span className="text-[#c3c7cd]">|</span>
                                <p className="text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                    Monitor platform health and critical notifications
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative w-full sm:w-[300px]">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b848f]" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search For Anything"
                                    className="h-10 w-full rounded-[6px] border border-[#e7ecef] bg-white pl-9 pr-4 text-[12px] text-[#222f36] [font-family:'Poppins',Helvetica] focus:outline-none focus:ring-2 focus:ring-[#eaf7ef]"
                                />
                            </div>
                            <button
                                type="button"
                                className="h-10 w-10 rounded-[6px] bg-white border border-[#e7ecef] flex items-center justify-center"
                            >
                                <Bell className="h-4 w-4 text-[#7b848f]" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="h-9 w-9 rounded-full overflow-hidden border border-[#e7ecef]">
                                    <img
                                        src="/figmaAssets/2-jpg.png"
                                        alt="Mr. Jack"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <span className="text-[12px] font-medium text-[#222f36] [font-family:'Poppins',Helvetica]">
                                    Mr. Jack
                                </span>
                            </div>
                            <button
                                type="button"
                                className="h-10 w-10 rounded-[6px] bg-white border border-[#e7ecef] flex items-center justify-center"
                            >
                                <Settings className="h-4 w-4 text-[#7b848f]" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                            {alertTabs.map((tab) => {
                                const isActive = activeTab === tab.label;
                                return (
                                <button
                                    key={tab.label}
                                    type="button"
                                    className={`h-9 px-4 rounded-[6px] text-[12px] font-medium flex items-center gap-2 ${
                                        isActive
                                            ? "bg-[#62a230] text-white"
                                            : "bg-white border border-[#edf1f3] text-[#7b848f]"
                                    }`}
                                    onClick={() => setActiveTab(tab.label)}
                                >
                                    {tab.label}
                                    <span
                                        className={`h-5 px-2 rounded-[6px] text-[11px] ${
                                            isActive
                                                ? "bg-white/20 text-white"
                                                : "bg-[#f1f4f6] text-[#7b848f]"
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                                );
                            })}
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center h-8 px-3 rounded-[6px] bg-[#fdecec] text-[#ef4444] text-[12px] font-medium gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                2 unacknowledged
                            </span>
                            <Button className="h-9 px-5 rounded-[6px] bg-[#62a230] text-white text-[12px] font-semibold">
                                Acknowledge All
                            </Button>
                        </div>
                    </div>

                    <div className="mt-5 space-y-4">
                        {filteredAlerts.map((alert, index) => {
                            const status =
                                statusStyles[alert.status as "Critical" | "Warning" | "Info"];
                            return (
                                <Card
                                    key={`${alert.title}-${index}`}
                                    className={`border-0 shadow-sm bg-white rounded-[16px] overflow-hidden`}
                                >
                                    <div className={`border-l-4 ${alert.accent}`}>
                                        <div className="p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className={`h-12 w-12 rounded-[14px] ${alert.iconBg} flex items-center justify-center`}
                                                >
                                                    <AlertTriangle className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                                            {alert.title}
                                                        </div>
                                                        <span
                                                            className={`inline-flex items-center h-5 px-2 rounded-[6px] text-[10px] font-semibold uppercase tracking-[0.4px] ${status.bg} ${status.text}`}
                                                        >
                                                            {alert.status}
                                                        </span>
                                                        {alert.acknowledged ? (
                                                            <span className="inline-flex items-center h-5 px-2 rounded-[6px] bg-[#eaf7ef] text-[#16a249] text-[10px] font-medium gap-1">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Acknowledged
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                    <div className="mt-2 text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                                        {alert.description}
                                                    </div>
                                                    <div className="mt-2 text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                                        {alert.time}
                                                    </div>
                                                </div>
                                            </div>
                                                <div className="flex items-center gap-3 justify-end">
                                                    {!alert.acknowledged ? (
                                                        <Button className="h-9 px-5 rounded-[6px] bg-[#62a230] text-white text-[12px] font-semibold">
                                                            Acknowledge
                                                        </Button>
                                                    ) : null}
                                                    <button
                                                        type="button"
                                                        className="h-9 w-9 rounded-[6px] border border-[#edf1f3] bg-white flex items-center justify-center"
                                                    >
                                                        <X className="h-4 w-4 text-[#7b848f]" />
                                                    </button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
