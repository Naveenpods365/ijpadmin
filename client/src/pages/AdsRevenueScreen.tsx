import { useMemo, useState } from "react";
import {
    ArrowUpRight,
    BarChart3,
    Bell,
    ChartLine,
    DollarSign,
    Menu,
    Settings as SettingsIcon,
    TrendingUp,
} from "lucide-react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DashboardHeader } from "@/pages/Dashboard/DashboardHeader";
import {
    AdSpenderDetailsPopup,
    type AdSpenderRow,
} from "@/components/AdSpenderDetailsPopup";
import { AdSpenderDetailsDrawer } from "@/components/AdSpenderDetailsDrawer";
import { useToast } from "@/hooks/use-toast";

const kpis = [
    {
        title: "Active Campaigns",
        value: "892",
        sub: "of 1245 total",
        iconBg: "bg-[#62a230]",
        icon: TrendingUp,
    },
    {
        title: "Average CTR",
        value: "3.2%",
        sub: "Average CTR",
        iconBg: "bg-[#0ea5e9]",
        icon: ChartLine,
        badge: "+0.3%",
        badgeColor: "text-[#0ea5e9] bg-[#e9f7ff]",
    },
    {
        title: "Total Impressions",
        value: "45.6M",
        sub: "Total Impressions",
        iconBg: "bg-[#f59f0a]",
        icon: BarChart3,
    },
    {
        title: "Revenue MTD",
        value: "$168,450",
        sub: "Revenue MTD",
        iconBg: "bg-[#a855f7]",
        icon: DollarSign,
        badge: "+12%",
        badgeColor: "text-[#a855f7] bg-[#f3e8ff]",
    },
];

const spendByCategory = [
    { name: "Electronics", value: 52000 },
    { name: "Fashion", value: 48000 },
    { name: "Automotive", value: 36000 },
    { name: "Home &\nGarden", value: 24000 },
    { name: "Beauty", value: 21000 },
    { name: "Sports", value: 14000 },
    { name: "Food &\nBeverages", value: 7000 },
];

const ctrByCategory = [
    { name: "Electronics", value: 3.9 },
    { name: "Fashion", value: 3.2 },
    { name: "Automotive", value: 3.1 },
    { name: "Home & Garden", value: 3.0 },
    { name: "Beauty", value: 3.6 },
    { name: "Sports", value: 3.3 },
    { name: "Food & Beverages", value: 2.9 },
];

const topSpenders = [
    {
        vendor: "BeautyBliss Co",
        spend: 32100,
        impressions: "4.2M",
        ctr: 4.2,
        performance: "Above avg",
        performancePct: 78,
    },
    {
        vendor: "FashionHub Elite",
        spend: 24500,
        impressions: "3.1M",
        ctr: 2.8,
        performance: "Average",
        performancePct: 46,
    },
    {
        vendor: "AutoLux Parts",
        spend: 12400,
        impressions: "1.8M",
        ctr: 3.6,
        performance: "Above avg",
        performancePct: 66,
    },
    {
        vendor: "PetParadise Shop",
        spend: 14200,
        impressions: "1.9M",
        ctr: 3.1,
        performance: "Average",
        performancePct: 52,
    },
    {
        vendor: "SportGear Pro",
        spend: 11200,
        impressions: "1.5M",
        ctr: 3.4,
        performance: "Above avg",
        performancePct: 61,
    },
];

function formatMoney(v: number) {
    return `$${v.toLocaleString()}`;
}

function SpendTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: Array<{ value?: number; payload?: { name?: string } }>;
}) {
    if (!active || !payload?.length) return null;
    const p = payload[0];
    return (
        <div className="bg-white border border-[#edf1f3] rounded-[10px] shadow-sm px-4 py-3">
            <div className="text-[#222f36] text-sm font-semibold">
                {p.payload?.name}
            </div>
            <div className="mt-1 text-[#62a230] text-sm">
                Ad spend:{" "}
                <span className="font-semibold">
                    {formatMoney(Number(p.value ?? 0))}
                </span>
            </div>
        </div>
    );
}

function CtrTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{ value?: number }>;
    label?: string;
}) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-[#edf1f3] rounded-[10px] shadow-sm px-4 py-3">
            <div className="text-[#222f36] text-sm font-semibold">{label}</div>
            <div className="mt-1 text-[#0ea5e9] text-sm">
                CTR:{" "}
                <span className="font-semibold">
                    {payload[0]?.value?.toFixed(1)}%
                </span>
            </div>
        </div>
    );
}

export const AdsRevenueScreen = (): JSX.Element => {
    const { toast } = useToast();
    const tableRows = useMemo(() => topSpenders, []);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [closeAdOpen, setCloseAdOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<AdSpenderRow | null>(
        null,
    );

    const openDetails = (row: AdSpenderRow) => {
        setSelectedVendor(row);
        setDrawerOpen(true);
    };

    return (
        <div className="bg-[#F5F6FA] w-full h-screen overflow-hidden">
            <AdSpenderDetailsDrawer
                open={drawerOpen}
                vendor={selectedVendor}
                onClose={() => setDrawerOpen(false)}
                onCloseAd={() => setCloseAdOpen(true)}
            />

            <AdSpenderDetailsPopup
                open={closeAdOpen}
                vendor={selectedVendor}
                onClose={() => setCloseAdOpen(false)}
                onSubmit={(payload) => {
                    toast({
                        title: "Close Ad submitted",
                        description: `${payload.vendor}`,
                    });
                    setCloseAdOpen(false);
                    setDrawerOpen(false);
                }}
            />

            <div className="hidden lg:block fixed inset-y-0 left-0 w-[312px] z-40">
                <Sidebar className="w-[280px]" variant="desktop" />
            </div>

            <main className="h-screen overflow-y-auto no-scrollbar lg:pl-[292px]">
                <div className="flex flex-col items-start gap-[14px] p-[16px] sm:p-[24px] overflow-x-hidden">
                    <div className="w-full flex items-center justify-between lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="bg-white border-[#e0ebe5]"
                                >
                                    <Menu className="h-5 w-5" />
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
                        <div className="text-[#222f36] font-semibold text-lg">
                            Ads & Revenue
                        </div>
                        <div className="w-10" />
                    </div>

                    <DashboardHeader
                        title="Ads & Revenue"
                        description="Advertising performance and revenue analytics"
                        onSearch={() => {}}
                    />

                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {kpis.map((k) => {
                            const Icon = k.icon;
                            return (
                                <Card
                                    key={k.title}
                                    className="relative rounded-[12px] border-0 bg-white shadow-[0px_1px_3px_#00000005,0px_6px_10px_#b1b1b114] p-5"
                                >
                                    {k.badge ? (
                                        <div
                                            className={
                                                "absolute right-4 top-4 h-6 rounded-full px-2.5 flex items-center text-[11px] font-semibold " +
                                                (k.badgeColor ?? "")
                                            }
                                        >
                                            {k.badge}
                                        </div>
                                    ) : null}
                                    <div className="flex items-start justify-between">
                                        <div
                                            className={
                                                "w-10 h-10 rounded-[10px] flex items-center justify-center " +
                                                k.iconBg
                                            }
                                        >
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                    <div className="mt-4 text-[#222f36] text-[22px] font-semibold leading-[26px]">
                                        {k.value}
                                    </div>
                                    <div className="mt-1 text-[#7b848f] text-[11px]">
                                        {k.title}
                                        {k.sub ? (
                                            <span className="block text-[#b0b6bf]">
                                                {k.sub}
                                            </span>
                                        ) : null}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <Card className="rounded-[12px] border-0 bg-white shadow-[0px_1px_3px_#00000005,0px_6px_10px_#b1b1b114] p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-[#222f36] text-[13px] font-semibold">
                                        Ad Spend by Category
                                    </div>
                                    <div className="text-[#7b848f] text-[11px]">
                                        Monthly breakdown
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="text-[#7b848f] text-[11px] font-medium hover:text-[#222f36]"
                                >
                                    Export <span className="ml-1">→</span>
                                </button>
                            </div>

                            <div className="mt-4 h-[240px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={spendByCategory}
                                        layout="vertical"
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            horizontal={false}
                                            stroke="#edf1f3"
                                        />
                                        <XAxis
                                            type="number"
                                            axisLine={false}
                                            tickLine={false}
                                            tickMargin={10}
                                            tick={{
                                                fill: "#7b848f",
                                                fontSize: 10,
                                            }}
                                            tickFormatter={(v) =>
                                                `$${Math.round(Number(v) / 1000)}K`
                                            }
                                        />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            axisLine={false}
                                            tickLine={false}
                                            width={90}
                                            tick={{
                                                fill: "#7b848f",
                                                fontSize: 10,
                                            }}
                                        />
                                        <Tooltip
                                            cursor={{
                                                fill: "rgba(0,0,0,0.03)",
                                            }}
                                            content={<SpendTooltip />}
                                        />
                                        <Bar
                                            dataKey="value"
                                            radius={[0, 8, 8, 0]}
                                            barSize={30}
                                            fill="#62a230"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="rounded-[12px] border-0 bg-white shadow-[0px_1px_3px_#00000005,0px_6px_10px_#b1b1b114] p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-[#222f36] text-[13px] font-semibold">
                                        CTR by Category
                                    </div>
                                    <div className="text-[#7b848f] text-[11px]">
                                        Click-through rates
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 h-[240px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={ctrByCategory}>
                                        <defs>
                                            <linearGradient
                                                id="ctrFill"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor="#0ea5e9"
                                                    stopOpacity={0.2}
                                                />
                                                <stop
                                                    offset="100%"
                                                    stopColor="#0ea5e9"
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
                                            interval={0}
                                            tick={{
                                                fill: "#7b848f",
                                                fontSize: 9,
                                            }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            width={30}
                                            tick={{
                                                fill: "#7b848f",
                                                fontSize: 10,
                                            }}
                                            tickFormatter={(v) => `${v}%`}
                                        />
                                        <Tooltip
                                            cursor={{ stroke: "#cfe9ff" }}
                                            content={<CtrTooltip />}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#0ea5e9"
                                            strokeWidth={2}
                                            fill="url(#ctrFill)"
                                            dot={false}
                                            activeDot={{
                                                r: 5,
                                                fill: "#0ea5e9",
                                                stroke: "#fff",
                                                strokeWidth: 2,
                                            }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>

                    <Card className="w-full rounded-[12px] border-0 bg-white shadow-[0px_1px_3px_#00000005,0px_6px_10px_#b1b1b114] overflow-hidden">
                        <div className="p-5 flex items-start justify-between gap-4">
                            <div>
                                <div className="text-[#222f36] text-[13px] font-semibold">
                                    Top Ad Spenders
                                </div>
                                <div className="text-[#7b848f] text-[11px]">
                                    Vendors with highest advertising spend
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className="h-8 rounded-[10px] bg-[#eef2f1] border-[#eef2f1] text-[#222f36] text-[11px]"
                            >
                                View All Vendors
                            </Button>
                        </div>

                        <div className="px-5 pb-5">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-[#edf1f3]">
                                        <TableHead className="text-[#7b848f] text-[11px] font-medium">
                                            Vendor
                                        </TableHead>
                                        <TableHead className="text-[#7b848f] text-[11px] font-medium">
                                            Ad Spend
                                        </TableHead>
                                        <TableHead className="text-[#7b848f] text-[11px] font-medium">
                                            Impressions
                                        </TableHead>
                                        <TableHead className="text-[#7b848f] text-[11px] font-medium">
                                            CTR
                                        </TableHead>
                                        <TableHead className="text-[#7b848f] text-[11px] font-medium">
                                            Performance
                                        </TableHead>
                                        <TableHead className="text-right text-[#7b848f] text-[11px] font-medium">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tableRows.map((r) => (
                                        <TableRow
                                            key={r.vendor}
                                            className="border-[#edf1f3]"
                                        >
                                            <TableCell className="text-[#222f36] text-[12px] font-medium">
                                                {r.vendor}
                                            </TableCell>
                                            <TableCell className="text-[#16a249] text-[12px] font-semibold">
                                                {formatMoney(r.spend)}
                                            </TableCell>
                                            <TableCell className="text-[#222f36] text-[12px]">
                                                {r.impressions}
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center h-6 rounded-full px-2.5 text-[11px] font-semibold bg-[#e6f6ec] text-[#16a249]">
                                                    {r.ctr.toFixed(1)}%
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-[88px] h-2 rounded-full bg-[#eef2f1] overflow-hidden">
                                                        <div
                                                            className="h-full bg-[#16a249]"
                                                            style={{
                                                                width: `${r.performancePct}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="text-[11px] text-[#7b848f]">
                                                        {r.performance}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openDetails(r)
                                                    }
                                                    className="text-[#16a249] text-[12px] font-semibold hover:underline inline-flex items-center gap-1"
                                                >
                                                    View Details
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
};
