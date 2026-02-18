import { useEffect, useMemo, useState } from "react";
import {
    Bell,
    LineChart as LineChartIcon,
    Search,
    Settings,
    Trash2,
    X,
} from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const sentimentData = [
    { week: "Week 1", positive: 65, neutral: 22, negative: 12 },
    { week: "Week 2", positive: 72, neutral: 20, negative: 10 },
    { week: "Week 3", positive: 70, neutral: 21, negative: 9 },
    { week: "Week 4", positive: 78, neutral: 18, negative: 8 },
    { week: "Week 5", positive: 80, neutral: 17, negative: 7 },
    { week: "Week 6", positive: 82, neutral: 16, negative: 6 },
];

const topics = [
    { label: "Build Quality", mentions: 156, percent: 92, color: "#5ba82c" },
    { label: "Price Value", mentions: 134, percent: 78, color: "#eab308" },
    { label: "Performance", mentions: 98, percent: 95, color: "#5ba82c" },
    { label: "Customer Service", mentions: 87, percent: 88, color: "#5ba82c" },
    { label: "Delivery Speed", mentions: 72, percent: 65, color: "#f97316" },
] as const;

const filterTabs = [
    "All User",
    "Only Users",
    "Vendors",
    "Spam Comments",
] as const;

const deleteReasons = [
    "Inappropriate Content",
    "Spam Content",
    "Inappropriate Content",
    "Inappropriate Content",
] as const;

type CommentRow = {
    id: string;
    user: string;
    role: "Vendor" | "User";
    postTitle: string;
    postImage: string;
    comment: string;
    time: string;
    isSpam: boolean;
};

const commentsSeed: CommentRow[] = Array.from({ length: 9 }).map((_, idx) => ({
    id: `c-${idx + 1}`,
    user: "John Doe",
    role: idx % 2 === 0 ? "Vendor" : "User",
    postTitle: "Amazing Laptop Deal",
    postImage: "/figmaAssets/2-jpg.png",
    comment:
        "Great deal! \ud83d\udd25\ud83d\udd25\ud83d\udd25 Thanks for sharing",
    time: "20 min ago",
    isSpam: idx % 5 === 0,
}));

const sentimentLegend = [
    { label: "Positive", color: "#5ba82c" },
    { label: "Neutral", color: "#94a3b8" },
    { label: "Negative", color: "#ef4444" },
] as const;

export function CommentsScreen() {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] =
        useState<(typeof filterTabs)[number]>("All User");
    const [page, setPage] = useState(1);
    const [deleteStep, setDeleteStep] = useState<"none" | "confirm" | "reason">(
        "none",
    );
    const [deleteTarget, setDeleteTarget] = useState<CommentRow | null>(null);
    const [deleteReason, setDeleteReason] = useState(deleteReasons[0]);
    const [customReason, setCustomReason] = useState("");
    const [isModalActive, setIsModalActive] = useState(false);

    useEffect(() => {
        if (deleteStep === "none") return;
        setIsModalActive(false);
        const frame = requestAnimationFrame(() => setIsModalActive(true));
        return () => cancelAnimationFrame(frame);
    }, [deleteStep]);

    const openDeleteConfirm = (row: CommentRow) => {
        setDeleteTarget(row);
        setDeleteReason(deleteReasons[0]);
        setCustomReason("");
        setDeleteStep("confirm");
    };

    const closeDeleteModal = () => {
        setIsModalActive(false);
        setTimeout(() => {
            setDeleteStep("none");
            setDeleteTarget(null);
        }, 180);
    };

    const filteredComments = useMemo(() => {
        const q = search.trim().toLowerCase();
        return commentsSeed.filter((row) => {
            const matchesSearch =
                row.user.toLowerCase().includes(q) ||
                row.postTitle.toLowerCase().includes(q) ||
                row.comment.toLowerCase().includes(q);

            const matchesTab =
                activeTab === "All User" ||
                (activeTab === "Only Users" && row.role === "User") ||
                (activeTab === "Vendors" && row.role === "Vendor") ||
                (activeTab === "Spam Comments" && row.isSpam);

            return matchesSearch && matchesTab;
        });
    }, [search, activeTab]);

    const pageSize = 6;
    const totalPages = Math.max(
        1,
        Math.ceil(filteredComments.length / pageSize),
    );
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const pageRows = filteredComments.slice(startIndex, startIndex + pageSize);
    const showingFrom = filteredComments.length ? startIndex + 1 : 0;
    const showingTo = Math.min(startIndex + pageSize, filteredComments.length);

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
                                        <span className="sr-only">
                                            Open menu
                                        </span>
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5 text-[#7b848f]"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line
                                                x1="3"
                                                y1="12"
                                                x2="21"
                                                y2="12"
                                            />
                                            <line
                                                x1="3"
                                                y1="6"
                                                x2="21"
                                                y2="6"
                                            />
                                            <line
                                                x1="3"
                                                y1="18"
                                                x2="21"
                                                y2="18"
                                            />
                                        </svg>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="p-0 bg-transparent border-0"
                                >
                                    <Sidebar
                                        className="w-[280px]"
                                        variant="drawer"
                                    />
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-[20px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                    Comments
                                </h1>
                                <span className="text-[#c3c7cd]">|</span>
                                <p className="text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                    Manage and moderate user comments
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
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

                    <Card className="mt-5 rounded-[16px] border-0 bg-white shadow-sm">
                        <div className="p-5">
                            <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                AI Comment Sentiment Analysis
                            </div>
                            <div className="text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                Deep analysis of customer feedback from posts &
                                comments
                            </div>

                            <div className="mt-4 grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-4">
                                <div className="rounded-[14px] bg-[#f9fafb] p-4">
                                    <div className="flex items-center gap-2 text-[12px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                        <span className="h-6 w-6 rounded-[6px] bg-[#eaf7ef] text-[#5ba82c] inline-flex items-center justify-center">
                                            <LineChartIcon className="h-4 w-4" />
                                        </span>
                                        Sentiment Trend Over Time
                                    </div>
                                    <div className="mt-3 h-[170px]">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <AreaChart data={sentimentData}>
                                                <defs>
                                                    <linearGradient
                                                        id="posFill"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="#5ba82c"
                                                            stopOpacity={0.22}
                                                        />
                                                        <stop
                                                            offset="100%"
                                                            stopColor="#5ba82c"
                                                            stopOpacity={0.02}
                                                        />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid
                                                    stroke="#e5e7eb"
                                                    vertical={false}
                                                    strokeDasharray="2 6"
                                                />
                                                <XAxis
                                                    dataKey="week"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fill: "#9aa3af",
                                                        fontSize: 10,
                                                    }}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fill: "#9aa3af",
                                                        fontSize: 10,
                                                    }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        borderRadius: 10,
                                                        border: "1px solid #edf1f3",
                                                        boxShadow:
                                                            "0 10px 30px rgba(0,0,0,0.08)",
                                                    }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="positive"
                                                    stroke="#5ba82c"
                                                    strokeWidth={2}
                                                    fill="url(#posFill)"
                                                    dot={false}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="neutral"
                                                    stroke="#94a3b8"
                                                    strokeWidth={2}
                                                    dot={false}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="negative"
                                                    stroke="#ef4444"
                                                    strokeWidth={2}
                                                    dot={false}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-[#7b848f]">
                                        {sentimentLegend.map((item) => (
                                            <div
                                                key={item.label}
                                                className="flex items-center gap-2"
                                            >
                                                <span
                                                    className="h-2 w-2 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            item.color,
                                                    }}
                                                />
                                                {item.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-[14px] bg-[#f9fafb] p-4">
                                    <div className="flex items-center gap-2 text-[12px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                        <span className="h-6 w-6 rounded-[6px] bg-[#ecfdf3] text-[#5ba82c] inline-flex items-center justify-center">
                                            <LineChartIcon className="h-4 w-4" />
                                        </span>
                                        Top Mentioned Topics
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        {topics.map((topic, index) => (
                                            <div
                                                key={topic.label}
                                                className="space-y-1"
                                            >
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <div className="flex items-center gap-3 text-[#222f36]">
                                                        <span className="text-[#9aa3af]">
                                                            {index + 1}
                                                        </span>
                                                        <span className="font-medium [font-family:'Poppins',Helvetica]">
                                                            {topic.label}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[#9aa3af]">
                                                        <span>
                                                            {topic.mentions}{" "}
                                                            mentions
                                                        </span>
                                                        <span className="text-[#5ba82c]">
                                                            {topic.percent}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-[#e5e7eb] overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            width: `${topic.percent}%`,
                                                            backgroundColor:
                                                                topic.color,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="mt-5 rounded-[14px] border-0 bg-white shadow-sm">
                        <div className="p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                                {filterTabs.map((tab) => {
                                    const isActive = activeTab === tab;
                                    const isSpam = tab === "Spam Comments";
                                    return (
                                        <button
                                            key={tab}
                                            type="button"
                                            onClick={() => setActiveTab(tab)}
                                            className={`h-8 px-4 rounded-[6px] text-[11px] font-medium ${
                                                isActive
                                                    ? "bg-[#62a230] text-white"
                                                    : isSpam
                                                      ? "border border-[#fca5a5] text-[#ef4444] bg-white"
                                                      : "bg-white border border-[#edf1f3] text-[#7b848f]"
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="relative w-full lg:w-[320px]">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa3af]" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by Comments by keyword"
                                    className="h-9 w-full rounded-[6px] border border-[#edf1f3] bg-white pl-9 pr-3 text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica] focus:outline-none focus:ring-2 focus:ring-[#eaf7ef]"
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="mt-5 rounded-[14px] border-0 bg-white shadow-sm">
                        <div className="px-2 pb-3">
                            <div className="rounded-[12px] border border-[#edf1f3] overflow-hidden mt-2">
                                <table className="w-full text-[11px]">
                                    <thead className="bg-[#f6f7f9] ">
                                        <tr className="text-[#9aa3af]">
                                            <th className="text-left font-medium px-4 py-3">
                                                Posted By
                                            </th>
                                            <th className="text-left font-medium px-4 py-3">
                                                Post
                                            </th>
                                            <th className="text-left font-medium px-4 py-3">
                                                Comment
                                            </th>
                                            <th className="text-right font-medium px-4 py-3">
                                                More
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageRows.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="border-b border-[#f0f2f4]"
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-[#f6f8fa] border border-[#edf1f3]">
                                                            <img
                                                                src="/figmaAssets/2-jpg.png"
                                                                alt="avatar"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="text-[11px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                                                {row.user}
                                                            </div>
                                                            <div className="text-[10px] text-[#7b848f]">
                                                                {row.role}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-[6px] overflow-hidden border border-[#edf1f3]">
                                                            <img
                                                                src={
                                                                    row.postImage
                                                                }
                                                                alt={
                                                                    row.postTitle
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="text-[11px] text-[#222f36] [font-family:'Poppins',Helvetica]">
                                                            {row.postTitle}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-[11px] text-[#222f36] [font-family:'Poppins',Helvetica]">
                                                        {row.comment}
                                                    </div>
                                                    <div className="text-[10px] text-[#9aa3af]">
                                                        {row.time}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        type="button"
                                                        className="h-8 w-8 rounded-[6px] border border-transparent hover:bg-[#f6f8fa] inline-flex items-center justify-center"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-[#9aa3af]" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="px-4 py-4 flex items-center justify-between text-[11px] text-[#7b848f]">
                                <div>
                                    Showing {showingFrom} to {showingTo} list in{" "}
                                    {totalPages} page
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPage(Math.max(1, safePage - 1))
                                        }
                                        className="h-8 w-8 rounded-full bg-[#f6f8fa] flex items-center justify-center"
                                    >
                                        <span className="text-[#7b848f]">
                                            ‹
                                        </span>
                                    </button>
                                    {[1, 2, 3, 4, 5]
                                        .slice(0, totalPages)
                                        .map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setPage(p)}
                                                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                                    safePage === p
                                                        ? "bg-[#62a230] text-white"
                                                        : "text-[#7b848f]"
                                                }`}
                                            >
                                                {String(p).padStart(2, "0")}
                                            </button>
                                        ))}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPage(
                                                Math.min(
                                                    totalPages,
                                                    safePage + 1,
                                                ),
                                            )
                                        }
                                        className="h-8 w-8 rounded-full bg-[#f6f8fa] flex items-center justify-center"
                                    >
                                        <span className="text-[#7b848f]">
                                            ›
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}
