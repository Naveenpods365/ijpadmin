import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
    Bell,
    ChevronDown,
    Loader2,
    MoreHorizontal,
    Search,
    Settings,
    TriangleAlert,
    UserRound,
    UserRoundCheck,
    UserRoundMinus,
    Users,
} from "lucide-react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { userService } from "@/services/userService";
import { format } from "date-fns";
import { getAvatarUrl } from "@/lib/utils";

const statCards = [
    {
        label: "Total Users",
        value: "1,234",
        icon: Users,
        iconBg: "bg-[#f3e9ff]",
        iconColor: "text-[#7c3aed]",
    },
    {
        label: "Active Users",
        value: "1,234",
        icon: UserRoundCheck,
        iconBg: "bg-[#ecfbe8]",
        iconColor: "text-[#4d7c0f]",
    },
    {
        label: "InActive Users",
        value: "1,234",
        icon: UserRoundMinus,
        iconBg: "bg-[#f4f5f7]",
        iconColor: "text-[#8b8f95]",
    },
    {
        label: "Total Vendors",
        value: "1,234",
        icon: UserRound,
        iconBg: "bg-[#e8f3ff]",
        iconColor: "text-[#3b82f6]",
    },
    {
        label: "Total User Reports",
        value: "1,234",
        icon: TriangleAlert,
        iconBg: "bg-[#ffeceb]",
        iconColor: "text-[#ef4444]",
    },
] as const;

const activityData = [
    { day: "2 Oct", value: 50 },
    { day: "3 Oct", value: 80 },
    { day: "4 Oct", value: 90 },
    { day: "5 Oct", value: 65 },
    { day: "6 Oct", value: 70 },
    { day: "7 Oct", value: 120 },
    { day: "8 Oct", value: 140 },
    { day: "9 Oct", value: 135 },
    { day: "10 Oct", value: 110 },
    { day: "11 Oct", value: 150 },
    { day: "12 Oct", value: 175 },
    { day: "13 Oct", value: 140 },
    { day: "14 Oct", value: 95 },
    { day: "15 Oct", value: 100 },
];


const alerts = [
    {
        title: "Vendor Fraud Detection",
        description: "Suspicious receipt patterns detected across 14 vendors",
        time: "9:20:00 AM",
        tone: "critical",
    },
    {
        title: "Vendor Risk",
        description: "Vendor 'AutoLux Parts' risk score increased to 72/100",
        time: "8:45:00 AM",
        tone: "warning",
    },
    {
        title: "User Fraud Detection",
        description: "Suspicious receipt patterns detected across 14 Users",
        time: "9:20:00 AM",
        tone: "critical",
    },
] as const;

const filterTabs = [
    "All User",
    "Only Users",
    "Vendors",
    "Suspended",
    "Blocked users",
] as const;

const activityStyles: Record<string, { bg: string; text: string }> = {
    High: { bg: "bg-[#e9f7ef]", text: "text-[#16a249]" },
    Medium: { bg: "bg-[#fff4e5]", text: "text-[#f59f0a]" },
    Low: { bg: "bg-[#f3f4f6]", text: "text-[#6b7280]" },
};

const statusStyles: Record<string, { bg: string; text: string }> = {
    ACTIVE: { bg: "bg-[#eaf7ef]", text: "text-[#16a249]" },
    INACTIVE: { bg: "bg-[#f3f4f6]", text: "text-[#6b7280]" },
    SUSPENDED: { bg: "bg-[#fee2e2]", text: "text-[#ef4444]" },
    BLOCKED: { bg: "bg-[#fee2e2]", text: "text-[#ef4444]" },
};

const alertTone = {
    critical: {
        chipBg: "bg-white",
        chipText: "text-[#ef4444]",
        border: "border-[#ef4444]",
        panel: "bg-[#fdeef0]",
    },
    warning: {
        chipBg: "bg-white",
        chipText: "text-[#f59f0a]",
        border: "border-[#f59f0a]",
        panel: "bg-[#fbf3e7]",
    },
};

const ChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const value = payload[0]?.value;
    return (
        <div className="rounded-[10px] bg-white px-3 py-2 shadow-[0_10px_20px_rgba(15,23,42,0.08)] border border-[#eef2f6]">
            <div className="text-[9px] uppercase text-[#9aa3af]">{label}</div>
            <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                {Number(value).toLocaleString()}
            </div>
        </div>
    );
};

export function UsersScreen() {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] =
        useState<(typeof filterTabs)[number]>("All User");
    const [page, setPage] = useState(1);
    const [, setLocation] = useLocation();

    // Map active tab to query params
    const queryParams = useMemo(() => {
        const params: any = { page, limit: 10 };
        if (search) params.search = search;
        
        if (activeTab === "Only Users") params.accountType = "USER";
        if (activeTab === "Vendors") params.accountType = "VENDOR";
        // Note: The API currently only supports accountType. 
        // For "Suspended" and "Blocked users", we might need backend support or client-side filtering.
        // Given the request, we'll focus on accountType for now.
        
        return params;
    }, [page, search, activeTab]);

    const { data, isLoading } = useQuery({
        queryKey: ["users", queryParams],
        queryFn: () => userService.listUsers(queryParams),
    });

    const users = useMemo(() => {
        if (!data?.data?.accounts) return [];
        let filtered = data.data.accounts;

        // Client-side filtering for status if needed, as per UI tabs
        if (activeTab === "Suspended") {
            filtered = filtered.filter(u => u.accountStatus === "SUSPENDED");
        }
        if (activeTab === "Blocked users") {
            filtered = filtered.filter(u => u.isBlocked);
        }

        return filtered;
    }, [data, activeTab]);

    const pagination = data?.data?.pagination;

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
                                    Users
                                </h1>
                                <span className="text-[#c3c7cd]">|</span>
                                <p className="text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                    Manage all users on the platform
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

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                        {statCards.map((card) => (
                            <Card
                                key={card.label}
                                className="rounded-[12px] border-0 bg-white shadow-sm"
                            >
                                <div className="p-4 flex items-center justify-between">
                                    <div>
                                        <div className="text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                            {card.label}
                                        </div>
                                        <div className="mt-1 text-[16px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                            {card.value}
                                        </div>
                                    </div>
                                    <div
                                        className={`h-10 w-10 rounded-full ${card.iconBg} flex items-center justify-center`}
                                    >
                                        <card.icon
                                            className={`h-5 w-5 ${card.iconColor}`}
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-5 grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-5">
                        <div className="space-y-4">
                            {alerts.map((alert) => {
                                const tone = alertTone[alert.tone];
                                return (
                                    <Card
                                        key={alert.title}
                                        className={`border-l-4 ${tone.border} ${tone.panel} rounded-[14px] shadow-sm`}
                                    >
                                        <div className="p-4 flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`text-[10px] uppercase tracking-[0.6px] font-semibold px-2 py-1 rounded-full ${tone.chipBg} ${tone.chipText} flex items-center gap-1`}
                                                >
                                                    <span
                                                        className={`h-2 w-2 rounded-full ${
                                                            alert.tone ===
                                                            "critical"
                                                                ? "bg-[#ef4444]"
                                                                : "bg-[#f59f0a]"
                                                        }`}
                                                    />
                                                    {alert.title}
                                                </span>
                                                <ChevronDown className="h-4 w-4 text-[#7b848f]" />
                                            </div>
                                            <div className="text-[12px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                                {alert.description}
                                            </div>
                                            <div className="text-[10px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                                {alert.time}
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>

                        <Card className="rounded-[14px] border-0 bg-white shadow-sm">
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                            Daily Active Users
                                        </div>
                                        <div className="text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                            Last 14 days trend
                                        </div>
                                    </div>
                                    <div className="h-8 px-3 rounded-[6px] border border-[#edf1f3] text-[11px] text-[#7b848f] flex items-center gap-2">
                                        2 Oct to 18 Oct, 2025
                                    </div>
                                </div>
                                <div className="mt-4 h-[220px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart data={activityData}>
                                            <CartesianGrid
                                                stroke="#d5dee7"
                                                strokeDasharray="4 4"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="day"
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
                                                tickFormatter={(value) =>
                                                    `${value}k`
                                                }
                                            />
                                            <Tooltip
                                                content={<ChartTooltip />}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#5ba82c"
                                                strokeWidth={3}
                                                dot={{
                                                    r: 4,
                                                    stroke: "#5ba82c",
                                                    strokeWidth: 2,
                                                    fill: "#fff",
                                                }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <Card className="mt-5 rounded-[14px] border-0 bg-white shadow-sm">
                        <div className="p-5">
                            <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                Filters
                            </div>
                            <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center">
                                <div className="flex flex-wrap items-center gap-2">
                                    {filterTabs.map((tab) => {
                                        const isActive = activeTab === tab;
                                        return (
                                            <button
                                                key={tab}
                                                type="button"
                                                onClick={() => {
                                                    setActiveTab(tab);
                                                    setPage(1);
                                                }}
                                                className={`h-8 px-4 rounded-[6px] text-[11px] font-medium ${
                                                    isActive
                                                        ? "bg-[#62a230] text-white"
                                                        : "bg-white border border-[#edf1f3] text-[#7b848f]"
                                                }`}
                                            >
                                                {tab}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa3af]" />
                                    <input
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search by name, mobile, or city..."
                                        className="h-9 w-full rounded-[6px] border border-[#edf1f3] bg-white pl-9 pr-3 text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica] focus:outline-none focus:ring-2 focus:ring-[#eaf7ef]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="px-2 pb-3">
                            <div className="rounded-[12px] border border-[#edf1f3] overflow-hidden min-h-[400px]">
                                <table className="w-full text-[11px]">
                                    <thead className="bg-[#f6f7f9]">
                                        <tr className="text-[#9aa3af]">
                                            <th className="text-left font-medium px-4 py-3">
                                                Name
                                            </th>
                                            <th className="text-left font-medium px-4 py-3">
                                                Mobile
                                            </th>
                                            <th className="text-left font-medium px-4 py-3">
                                                City
                                            </th>
                                            <th className="text-left font-medium px-4 py-3">
                                                Registration
                                            </th>
                                            <th className="text-left font-medium px-4 py-3">
                                                Activity
                                            </th>
                                            <th className="text-left font-medium px-4 py-3">
                                                Reports
                                            </th>
                                            <th className="text-left font-medium px-4 py-3">
                                                Status
                                            </th>
                                            <th className="text-left font-medium px-4 py-3">
                                                Profile Completion
                                            </th>
                                            <th className="text-left font-medium px-4 py-3 text-right">
                                                More
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                             <tr>
                                                <td colSpan={9} className="h-40 text-center text-[#7b848f]">
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <Loader2 className="h-6 w-6 animate-spin text-[#62a230]" />
                                                        <span>Loading users...</span>
                                                    </div>
                                                </td>
                                             </tr>
                                        ) : users.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="h-40 text-center text-[#7b848f]">
                                                    No users found
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((user) => {
                                                const activity = user.isActive ? activityStyles.High : activityStyles.Low;
                                                const statusKey = user.isBlocked ? "BLOCKED" : (user.accountStatus || "ACTIVE");
                                                const status = statusStyles[statusKey] || statusStyles.ACTIVE;
                                                
                                                // Derive display name
                                                const displayName = user.businessName || 
                                                    (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName) || 
                                                    user.username || 
                                                    user.email;
                                                
                                                // Derive display location
                                                const location = user.zipCode || user.registeredAddress || "-";

                                                // Derive registration date
                                                const regDate = user.createdAt ? format(new Date(user.createdAt), "dd MMM, yyyy") : "-";

                                                // Mock profile completion if not available
                                                const profileCompletion = 50; // default for now

                                                return (
                                                    <tr
                                                        key={user._id}
                                                        className="border-b border-[#f0f2f4] cursor-pointer hover:bg-[#f6f8fa]"
                                                        onClick={() => {
                                                            setLocation(
                                                                `/users/${user._id}`,
                                                            );
                                                        }}
                                                    >
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#f6f8fa] border border-[#edf1f3]">
                                                                    <img
                                                                        src={getAvatarUrl(user.avatarKey)}
                                                                        alt="avatar"
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[11px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                                                        {displayName}
                                                                    </span>
                                                                    <span className="text-[10px] text-[#7b848f]">
                                                                        {user.email}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-[#7b848f]">
                                                            {user.mobileNumber || "-"}
                                                        </td>
                                                        <td className="px-4 py-3 text-[#7b848f]">
                                                            {location}
                                                        </td>
                                                        <td className="px-4 py-3 text-[#7b848f]">
                                                            {regDate}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span
                                                                className={`inline-flex items-center h-5 px-2 rounded-full text-[10px] font-medium ${activity.bg} ${activity.text}`}
                                                            >
                                                                {user.isActive ? "Active" : "Inactive"}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span
                                                                className={`inline-flex items-center h-5 px-2 rounded-full text-[10px] font-medium bg-[#f3f4f6] text-[#9aa3af]`}
                                                            >
                                                                None
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span
                                                                className={`inline-flex items-center h-5 px-2 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}
                                                            >
                                                                {user.isBlocked ? "Blocked" : (user.accountStatus || "Active")}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex-1 h-2 rounded-full bg-[#eef2f6] overflow-hidden">
                                                                    <div
                                                                        className={`h-full rounded-full ${
                                                                            profileCompletion > 40
                                                                                ? "bg-[#4f8ef9]"
                                                                                : "bg-[#fb923c]"
                                                                        }`}
                                                                        style={{
                                                                            width: `${profileCompletion}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span className="text-[10px] text-[#7b848f]">
                                                                    {profileCompletion} %
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={(event) =>
                                                                    event.stopPropagation()
                                                                }
                                                                className="h-8 w-8 rounded-[6px] border border-transparent hover:bg-[#f6f8fa] inline-flex items-center justify-center"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4 text-[#7b848f]" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {pagination && (
                                <div className="px-4 py-4 flex items-center justify-between text-[11px] text-[#7b848f]">
                                    <div>
                                        Showing {Math.min((page - 1) * pagination.limit + 1, pagination.total)} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} entries
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className={`h-8 w-8 rounded-full bg-[#f6f8fa] flex items-center justify-center hover:bg-[#eef2f6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                                        >
                                            <span className="text-[#7b848f] text-lg leading-none mb-1">
                                                ‹
                                            </span>
                                        </button>
                                        
                                        {(() => {
                                            const totalPages = pagination.pages;
                                            const visiblePages = 5;
                                            const pages: (number | "...")[] = [];
                                            
                                            if (totalPages <= visiblePages + 2) {
                                                // Show all pages if total is small
                                                for (let i = 1; i <= totalPages; i++) {
                                                    pages.push(i);
                                                }
                                            } else {
                                                // Always show first page
                                                pages.push(1);
                                                
                                                let start = Math.max(2, page - 1);
                                                let end = Math.min(totalPages - 1, page + 1);
                                                
                                                // Adjust window if close to boundaries
                                                if (page <= 3) {
                                                    end = 4;
                                                }
                                                if (page >= totalPages - 2) {
                                                    start = totalPages - 3;
                                                }

                                                if (start > 2) {
                                                    pages.push("...");
                                                }
                                                
                                                for (let i = start; i <= end; i++) {
                                                    pages.push(i);
                                                }
                                                
                                                if (end < totalPages - 1) {
                                                    pages.push("...");
                                                }
                                                
                                                // Always show last page
                                                pages.push(totalPages);
                                            }

                                            return pages.map((p, idx) => {
                                                if (p === "...") {
                                                    return (
                                                        <span key={`ellipsis-${idx}`} className="text-[#7b848f] px-1">...</span>
                                                    );
                                                }
                                                return (
                                                    <button
                                                        key={p}
                                                        type="button"
                                                        onClick={() => setPage(p as number)}
                                                        className={`h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-medium transition-colors ${
                                                            page === p
                                                                ? "bg-[#62a230] text-white shadow-sm"
                                                                : "bg-white text-[#7b848f] hover:bg-[#f6f8fa] border border-transparent hover:border-[#edf1f3]"
                                                        }`}
                                                    >
                                                        {String(p).padStart(2, "0")}
                                                    </button>
                                                );
                                            });
                                        })()}
                                        
                                        <button
                                            type="button"
                                            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                                            disabled={page === pagination.pages}
                                            className={`h-8 w-8 rounded-full bg-[#f6f8fa] flex items-center justify-center hover:bg-[#eef2f6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                                        >
                                            <span className="text-[#7b848f] text-lg leading-none mb-1">
                                                ›
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}
