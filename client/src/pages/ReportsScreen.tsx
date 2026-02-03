import { useState } from "react";
import {
    Bell,
    Download,
    Eye,
    FileText,
    LineChart,
    Search,
    Settings,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    DollarSign,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const reportCards = [
    {
        title: "Weekly Platform Health Report",
        description:
            "Comprehensive overview of platform performance, user activity, and system health metrics",
        cadence: "Weekly",
        last: "Dec 28, 2024",
        icon: TrendingUp,
        iconBg: "bg-[#62a230]",
    },
    {
        title: "Monthly Revenue Report",
        description:
            "Detailed breakdown of all revenue streams, including subscriptions, ads, and transaction fees",
        cadence: "Monthly",
        last: "Dec 1, 2024",
        icon: DollarSign,
        iconBg: "bg-[#22c55e]",
    },
    {
        title: "Moderation Activity Report",
        description:
            "Summary of moderation actions, flagged content statistics, and enforcement outcomes",
        cadence: "Weekly",
        last: "Dec 28, 2024",
        icon: ShieldCheck,
        iconBg: "bg-[#f59f0a]",
    },
    {
        title: "Vendor Performance Report",
        description:
            "Analysis of vendor metrics including sales, ratings, compliance scores and growth trends",
        cadence: "Weekly",
        last: "Dec 25, 2024",
        icon: FileText,
        iconBg: "bg-[#38bdf8]",
    },
    {
        title: "Fraud Detection Summary",
        description:
            "AI-generated report on detected fraud patterns, false positives, and prevention effectiveness",
        cadence: "Daily",
        last: "Dec 28, 2024",
        icon: ShieldAlert,
        iconBg: "bg-[#ef4444]",
    },
    {
        title: "User Growth & Retention",
        description:
            "User acquisition, churn analysis, and engagement metrics across all user segments",
        cadence: "Weekly",
        last: "Dec 22, 2024",
        icon: LineChart,
        iconBg: "bg-[#8b5cf6]",
    },
] as const;

export function ReportsScreen() {
    const [search, setSearch] = useState("");

    return (
        <div className="min-h-screen bg-[#f3f5f6]">
            <div className="hidden lg:block fixed inset-y-0 left-0 w-[312px] z-40">
                <Sidebar className="w-[280px]" variant="desktop" />
            </div>

            <main className="min-h-screen overflow-y-auto no-scrollbar lg:pl-[282px]">
                <div className="px-4 pt-6 pb-10 lg:px-8">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="h-10 w-10 p-0 rounded-xl bg-white border border-[#edf1f3]"
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
                                    Reports
                                </h1>
                                <span className="text-[#c3c7cd]">|</span>
                                <p className="text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                    Generate and download platform reports
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
                                    className="h-10 w-full rounded-full border border-[#e7ecef] bg-white pl-9 pr-4 text-[12px] text-[#222f36] [font-family:'Poppins',Helvetica] focus:outline-none focus:ring-2 focus:ring-[#eaf7ef]"
                                />
                            </div>
                            <button
                                type="button"
                                className="h-10 w-10 rounded-full bg-white border border-[#e7ecef] flex items-center justify-center"
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
                                className="h-10 w-10 rounded-full bg-white border border-[#e7ecef] flex items-center justify-center"
                            >
                                <Settings className="h-4 w-4 text-[#7b848f]" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {reportCards.map((card) => (
                            <Card
                                key={card.title}
                                className="rounded-[14px] border border-[#edf1f3] shadow-sm bg-white"
                            >
                                <div className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div
                                            className={`h-10 w-10 rounded-[10px] ${card.iconBg} flex items-center justify-center shadow-sm`}
                                        >
                                            <card.icon className="h-5 w-5 text-white" />
                                        </div>
                                        <span className="inline-flex items-center h-6 px-3 rounded-full bg-[#f1f4f6] text-[#7b848f] text-[11px] font-medium">
                                            {card.cadence}
                                        </span>
                                    </div>
                                    <div className="mt-4">
                                        <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                            {card.title}
                                        </div>
                                        <div className="mt-2 text-[12px] text-[#7b848f] leading-5 [font-family:'Poppins',Helvetica]">
                                            {card.description}
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-[#edf1f3] flex flex-wrap items-center justify-between gap-3">
                                        <div className="text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                            Last: {card.last}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                className="h-8 w-8 rounded-[10px] border border-[#edf1f3] bg-white flex items-center justify-center"
                                            >
                                                <Eye className="h-4 w-4 text-[#7b848f]" />
                                            </button>
                                            <button
                                                type="button"
                                                className="h-8 px-3 rounded-[10px] bg-[#eaf7ef] text-[#16a249] text-[11px] font-medium flex items-center gap-1"
                                            >
                                                <Download className="h-3 w-3" />
                                                PDF
                                            </button>
                                            <button
                                                type="button"
                                                className="h-8 px-3 rounded-[10px] border border-[#edf1f3] text-[#222f36] text-[11px] font-medium flex items-center gap-1"
                                            >
                                                <Download className="h-3 w-3" />
                                                CSV
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Card className="mt-6 rounded-[14px] border border-[#edf1f3] bg-white">
                        <div className="p-5">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-[10px] bg-[#eaf7ef] text-[#16a249] flex items-center justify-center">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                        Custom Report Builder
                                    </div>
                                    <div className="text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        Create a custom report with specific date ranges and metrics
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr_auto] gap-4 items-end">
                                <div>
                                    <div className="text-[12px] font-medium text-[#222f36] [font-family:'Poppins',Helvetica]">
                                        Report Type
                                    </div>
                                    <div className="mt-2 h-10 rounded-[10px] border border-[#e7ecef] bg-[#f9fbfb] px-3 flex items-center text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        Platform Health
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[12px] font-medium text-[#222f36] [font-family:'Poppins',Helvetica]">
                                        Start Date
                                    </div>
                                    <input
                                        placeholder="mm/dd/yyyy"
                                        className="mt-2 h-10 w-full rounded-[10px] border border-[#e7ecef] bg-[#f9fbfb] px-3 text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica] focus:outline-none focus:ring-2 focus:ring-[#eaf7ef]"
                                    />
                                </div>
                                <div>
                                    <div className="text-[12px] font-medium text-[#222f36] [font-family:'Poppins',Helvetica]">
                                        End Date
                                    </div>
                                    <input
                                        placeholder="mm/dd/yyyy"
                                        className="mt-2 h-10 w-full rounded-[10px] border border-[#e7ecef] bg-[#f9fbfb] px-3 text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica] focus:outline-none focus:ring-2 focus:ring-[#eaf7ef]"
                                    />
                                </div>
                                <Button className="h-10 px-6 rounded-full bg-[#22c55e] text-white text-[12px] font-semibold flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    Generate Report
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}
