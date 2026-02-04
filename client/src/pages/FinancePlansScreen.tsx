import { useMemo, useState } from "react";
import {
    CreditCard,
    DollarSign,
    Download,
    MoreHorizontal,
    Printer,
    X,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardHeader } from "@/pages/Dashboard/DashboardHeader";

const kpis = [
    {
        title: "Monthly Revenue",
        value: "$544,300",
        sub: "Monthly Revenue",
        icon: DollarSign,
        iconBg: "bg-[#62a230]",
        change: "+11%",
    },
    {
        title: "Active Subscribers",
        value: "78,610",
        sub: "Active Subscribers",
        icon: CreditCard,
        iconBg: "bg-[#1d4ed8]",
        change: "+11%",
    },
    {
        title: "Avg Churn Rate",
        value: "1.3%",
        sub: "Avg Churn Rate",
        icon: TrendingDown,
        iconBg: "bg-[#f59f0a]",
        change: "+11%",
    },
    {
        title: "Failed Payments",
        value: "23",
        sub: "Failed Payments",
        icon: TrendingUp,
        iconBg: "bg-[#ef4444]",
        change: "+12%",
    },
] as const;

const revenueData = [
    { month: "Jul", subscriptions: 310, ads: 290, fees: 150 },
    { month: "Aug", subscriptions: 325, ads: 305, fees: 160 },
    { month: "Sep", subscriptions: 340, ads: 318, fees: 170 },
    { month: "Oct", subscriptions: 355, ads: 332, fees: 180 },
    { month: "Nov", subscriptions: 370, ads: 348, fees: 190 },
    { month: "Dec", subscriptions: 390, ads: 365, fees: 200 },
];

const platformFees = [
    { label: "Posting Fee", value: "$0.99" },
    { label: "Ad Fee %", value: "15%" },
    { label: "Admin Chat Fee", value: "$2.99" },
    { label: "Premium Listing", value: "$4.99" },
];

type Txn = {
    id: string;
    user: string;
    role: string;
    transferId: string;
    datetime: string;
    payment: string;
    status: "Completed" | "Failed" | "Pending";
    amount: string;
    revenueFrom: string;
};

const transactionsSeed: Txn[] = [
    {
        id: "t1",
        user: "John Doe",
        role: "Vendor",
        transferId: "S8X8X4564865",
        datetime: "10 Dec 2012",
        payment: "0077 **** **** 3814 (Visa)",
        status: "Completed",
        amount: "+$400",
        revenueFrom: "Product posting",
    },
    {
        id: "t2",
        user: "John Doe",
        role: "Vendor",
        transferId: "S8X8X4564865",
        datetime: "10 Dec 2012",
        payment: "0077 **** **** 3814 (Visa)",
        status: "Completed",
        amount: "+$400",
        revenueFrom: "Standard plan",
    },
    {
        id: "t3",
        user: "John Doe",
        role: "Vendor",
        transferId: "S8X8X4564865",
        datetime: "10 Dec 2012",
        payment: "0077 **** **** 3814 (Visa)",
        status: "Completed",
        amount: "+$400",
        revenueFrom: "Basic",
    },
    {
        id: "t4",
        user: "John Doe",
        role: "Vendor",
        transferId: "S8X8X4564865",
        datetime: "10 Dec 2012",
        payment: "0077 **** **** 3814 (Visa)",
        status: "Completed",
        amount: "+$400",
        revenueFrom: "Product posting",
    },
    {
        id: "t5",
        user: "John Doe",
        role: "Vendor",
        transferId: "S8X8X4564865",
        datetime: "10 Dec 2012",
        payment: "0077 **** **** 3814 (Visa)",
        status: "Completed",
        amount: "+$400",
        revenueFrom: "Product posting",
    },
    {
        id: "t6",
        user: "John Doe",
        role: "Vendor",
        transferId: "S8X8X4564865",
        datetime: "10 Dec 2012",
        payment: "0077 **** **** 3814 (Visa)",
        status: "Completed",
        amount: "+$400",
        revenueFrom: "Product posting",
    },
    {
        id: "t7",
        user: "John Doe",
        role: "Vendor",
        transferId: "S8X8X4564865",
        datetime: "10 Dec 2012",
        payment: "0077 **** **** 3814 (Visa)",
        status: "Completed",
        amount: "+$400",
        revenueFrom: "Product posting",
    },
];

export function FinancePlansScreen() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(2);
    const [selectedTxn, setSelectedTxn] = useState<Txn | null>(null);
    const [receiptOpen, setReceiptOpen] = useState(false);
    const [receiptActive, setReceiptActive] = useState(false);
    const [editPlanOpen, setEditPlanOpen] = useState(false);
    const [editPlanActive, setEditPlanActive] = useState(false);
    const [planName, setPlanName] = useState("Pro Plan");
    const [planPrice, setPlanPrice] = useState("$150/mth");
    const [planFeatures, setPlanFeatures] = useState([
        "Feature 1",
        "Feature 2",
        "Feature 3",
        "Feature 4",
        "Feature 5",
    ]);

    const transactions = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return transactionsSeed;
        return transactionsSeed.filter((t) => {
            return (
                t.user.toLowerCase().includes(q) ||
                t.transferId.toLowerCase().includes(q) ||
                t.payment.toLowerCase().includes(q) ||
                t.revenueFrom.toLowerCase().includes(q)
            );
        });
    }, [search]);

    const StatusPill = ({ status }: { status: Txn["status"] }) => {
        if (status === "Completed") {
            return (
                <span className="inline-flex items-center h-6 px-3 rounded-full bg-[#eaf7ef] text-[#16a249] text-[11px] font-medium">
                    Completed
                </span>
            );
        }
        if (status === "Failed") {
            return (
                <span className="inline-flex items-center h-6 px-3 rounded-full bg-[#fee2e2] text-[#ef4444] text-[11px] font-medium">
                    Failed
                </span>
            );
        }
        return (
            <span className="inline-flex items-center h-6 px-3 rounded-full bg-[#fff7ed] text-[#f59f0a] text-[11px] font-medium">
                Pending
            </span>
        );
    };

    const receiptDetails = {
        name: "Akhil Bhatt",
        handle: "@Akhil Bhatt50",
        status: "Completed",
        amount: "$300",
        description: "This is the receipt for a payment of $4000 (USD).",
        paymentMethod: "Google pay",
        paymentDate: "10 December, 2021 - 03:45 pm",
        item: "Product posting",
        itemDesc: "In semper pharetra eget porta odio imperdiet turpis facilisis co",
        qty: "1",
        total: "$4000",
    };

    const openReceipt = (txn: Txn) => {
        setSelectedTxn(txn);
        setReceiptOpen(true);
        requestAnimationFrame(() => setReceiptActive(true));
    };

    const closeReceipt = () => {
        setReceiptActive(false);
        setTimeout(() => {
            setReceiptOpen(false);
            setSelectedTxn(null);
        }, 200);
    };

    const openEditPlan = () => {
        setEditPlanOpen(true);
        requestAnimationFrame(() => setEditPlanActive(true));
    };

    const closeEditPlan = () => {
        setEditPlanActive(false);
        setTimeout(() => {
            setEditPlanOpen(false);
        }, 200);
    };

    return (
        <div className="min-h-screen bg-[#f3f5f6]">
            <div className="hidden lg:block fixed inset-y-0 left-0 w-[312px] z-40">
                <Sidebar className="w-[280px]" variant="desktop" />
            </div>

            <main className="h-screen overflow-y-auto no-scrollbar lg:pl-[282px]">
                <div className="px-4 pt-6 lg:px-8">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="h-10 w-10 p-0 rounded-xl bg-white border border-[#edf1f3]"
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

                        <DashboardHeader
                            title="Finance & Subscriptions"
                            description="Financial overview and subscription management"
                            onSearch={(q) => setSearch(q)}
                        />
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {kpis.map((k) => (
                            <Card
                                key={k.title}
                                className="rounded-[14px] border-0 shadow-sm bg-white"
                            >
                                <div className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div
                                            className={`h-10 w-10 rounded-[10px] ${k.iconBg} flex items-center justify-center`}
                                        >
                                            <k.icon className="h-5 w-5 text-white" />
                                        </div>
                                        <span className="inline-flex items-center h-6 px-3 rounded-full bg-[#eaf7ef] text-[#16a249] text-[11px] font-medium">
                                            {k.change}
                                        </span>
                                    </div>
                                    <div className="mt-4">
                                        <div className="text-[22px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                            {k.value}
                                        </div>
                                        <div className="mt-1 text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                            {k.sub}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-5 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
                        <Card className="rounded-[14px] border-0 shadow-sm bg-white overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[14px] text-[#222f36] [font-family:'Poppins',Helvetica]">
                                    Revenue Breakdown
                                </CardTitle>
                                <div className="text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                    6 month trend
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="h-[210px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <AreaChart
                                            data={revenueData}
                                            margin={{ left: 6, right: 10 }}
                                        >
                                            <defs>
                                                <linearGradient
                                                    id="subFill"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="0%"
                                                        stopColor="#22c55e"
                                                        stopOpacity={0.25}
                                                    />
                                                    <stop
                                                        offset="100%"
                                                        stopColor="#22c55e"
                                                        stopOpacity={0.0}
                                                    />
                                                </linearGradient>
                                                <linearGradient
                                                    id="adsFill"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="0%"
                                                        stopColor="#38bdf8"
                                                        stopOpacity={0.18}
                                                    />
                                                    <stop
                                                        offset="100%"
                                                        stopColor="#38bdf8"
                                                        stopOpacity={0.0}
                                                    />
                                                </linearGradient>
                                                <linearGradient
                                                    id="feesFill"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="0%"
                                                        stopColor="#f97316"
                                                        stopOpacity={0.14}
                                                    />
                                                    <stop
                                                        offset="100%"
                                                        stopColor="#f97316"
                                                        stopOpacity={0.0}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid
                                                stroke="#eef2f1"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{
                                                    fill: "#7b848f",
                                                    fontSize: 11,
                                                }}
                                            />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{
                                                    fill: "#7b848f",
                                                    fontSize: 11,
                                                }}
                                                width={30}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: 12,
                                                    border: "1px solid #edf1f3",
                                                    boxShadow:
                                                        "0 10px 30px rgba(0,0,0,0.08)",
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="subscriptions"
                                                stroke="#22c55e"
                                                strokeWidth={2}
                                                fill="url(#subFill)"
                                                dot={false}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="ads"
                                                stroke="#38bdf8"
                                                strokeWidth={2}
                                                fill="url(#adsFill)"
                                                dot={false}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="fees"
                                                stroke="#f97316"
                                                strokeWidth={2}
                                                fill="url(#feesFill)"
                                                dot={false}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="mt-3 flex items-center justify-center gap-6 text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                                        Subscriptions
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-[#38bdf8]" />
                                        Ads
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-[#f97316]" />
                                        Fees
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-[14px] border-0 shadow-sm bg-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[14px] text-[#222f36] [font-family:'Poppins',Helvetica] flex items-center gap-2">
                                    <span className="h-7 w-7 rounded-[10px] bg-[#eaf7ef] text-[#16a249] flex items-center justify-center text-[12px] font-semibold">
                                        $
                                    </span>
                                    Platform Fees
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-1">
                                <div className="space-y-3">
                                    {platformFees.map((f) => (
                                        <div
                                            key={f.label}
                                            className="flex items-center justify-between text-[12px]"
                                        >
                                            <div className="text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                                {f.label}
                                            </div>
                                            <div className="text-[#62a230] font-semibold [font-family:'Poppins',Helvetica]">
                                                {f.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="rounded-[14px] p-5 bg-gradient-to-br from-[#f2ffe8] via-white to-[#f7fbff] shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-[13px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                        Pro plan
                                    </div>
                                    <div className="mt-1 text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        Billed monthly.
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            type="button"
                                            className="h-9 w-9 rounded-[10px] bg-white border border-[#edf1f3] flex items-center justify-center"
                                        >
                                            <MoreHorizontal className="h-4 w-4 text-[#7b848f]" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-44"
                                    >
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onSelect={openEditPlan}
                                        >
                                            Edit Plan
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            Delete plan
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="mt-6 text-[28px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                $150/mth
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-4 text-[11px]">
                                <div>
                                    <div className="text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        Subscribers
                                    </div>
                                    <div className="mt-1 text-[#222f36] font-semibold [font-family:'Poppins',Helvetica]">
                                        45,200
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        Churn Rate
                                    </div>
                                    <div className="mt-1 text-[#f59f0a] font-semibold [font-family:'Poppins',Helvetica]">
                                        2.1%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        MRR
                                    </div>
                                    <div className="mt-1 text-[#16a249] font-semibold [font-family:'Poppins',Helvetica]">
                                        $451,548
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[14px] p-5 bg-gradient-to-br from-[#ffe7f3] via-white to-[#fff5fb] shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-[13px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                        Basic plan
                                    </div>
                                    <div className="mt-1 text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        Billed annually.
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            type="button"
                                            className="h-9 w-9 rounded-[10px] bg-white/70 border border-white/70 flex items-center justify-center"
                                        >
                                            <MoreHorizontal className="h-4 w-4 text-[#7b848f]" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-44"
                                    >
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onSelect={openEditPlan}
                                        >
                                            Edit Plan
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            Delete plan
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="mt-6 text-[28px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                $150/mth
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-4 text-[11px]">
                                <div>
                                    <div className="text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        Subscribers
                                    </div>
                                    <div className="mt-1 text-[#222f36] font-semibold [font-family:'Poppins',Helvetica]">
                                        45,200
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        Churn Rate
                                    </div>
                                    <div className="mt-1 text-[#f59f0a] font-semibold [font-family:'Poppins',Helvetica]">
                                        2.1%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        MRR
                                    </div>
                                    <div className="mt-1 text-[#16a249] font-semibold [font-family:'Poppins',Helvetica]">
                                        $451,548
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[14px] p-5 bg-gradient-to-br from-[#eef2ff] via-white to-[#faf5ff] shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-[13px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                        Premium Exclusive
                                    </div>
                                    <div className="mt-1 text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        TELLUS Family Plan
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            type="button"
                                            className="h-9 w-9 rounded-[10px] bg-white/70 border border-white/70 flex items-center justify-center"
                                        >
                                            <MoreHorizontal className="h-4 w-4 text-[#7b848f]" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-44"
                                    >
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onSelect={openEditPlan}
                                        >
                                            Edit Plan
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            Delete plan
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="mt-6 text-[28px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                $150/mth
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-4 text-[11px]">
                                <div>
                                    <div className="text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        Subscribers
                                    </div>
                                    <div className="mt-1 text-[#222f36] font-semibold [font-family:'Poppins',Helvetica]">
                                        45,200
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        Churn Rate
                                    </div>
                                    <div className="mt-1 text-[#f59f0a] font-semibold [font-family:'Poppins',Helvetica]">
                                        2.1%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        MRR
                                    </div>
                                    <div className="mt-1 text-[#16a249] font-semibold [font-family:'Poppins',Helvetica]">
                                        $451,548
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Card className="mt-5 mb-10 rounded-[14px] border-0 shadow-sm bg-white overflow-hidden">
                        <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4">
                            <div>
                                <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                    Recent Transactions
                                </div>
                                <div className="text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                    Latest financial activity
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className="h-9 rounded-[10px] bg-white border border-[#edf1f3] text-[#222f36]"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Export All List To Excel
                            </Button>
                        </div>

                        <div className="px-2 pb-2">
                            <div className="rounded-[12px] border border-[#edf1f3] overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-[#f6f8fa]">
                                            <TableHead className="text-[11px] text-[#7b848f] font-medium">
                                                User Id
                                            </TableHead>
                                            <TableHead className="text-[11px] text-[#7b848f] font-medium">
                                                Transfer ID
                                            </TableHead>
                                            <TableHead className="text-[11px] text-[#7b848f] font-medium">
                                                Date & Time
                                            </TableHead>
                                            <TableHead className="text-[11px] text-[#7b848f] font-medium">
                                                Payment Method
                                            </TableHead>
                                            <TableHead className="text-[11px] text-[#7b848f] font-medium">
                                                Status
                                            </TableHead>
                                            <TableHead className="text-[11px] text-[#7b848f] font-medium">
                                                Amount
                                            </TableHead>
                                            <TableHead className="text-[11px] text-[#7b848f] font-medium">
                                                Revenue From
                                            </TableHead>
                                            <TableHead className="text-[11px] text-[#7b848f] font-medium text-right">
                                                More
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactions.map((t) => (
                                            <TableRow
                                                key={t.id}
                                                className="cursor-pointer hover:bg-[#f6f8fa]"
                                                onClick={() => openReceipt(t)}
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-[#f6f8fa] border border-[#edf1f3]">
                                                            <img
                                                                src="/figmaAssets/2-jpg.png"
                                                                alt="avatar"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="text-[12px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                                                {t.user}
                                                            </div>
                                                            <div className="text-[10px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                                                {t.role}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-[11px] text-[#7b848f]">
                                                    {t.transferId}
                                                </TableCell>
                                                <TableCell className="text-[11px] text-[#7b848f]">
                                                    {t.datetime}
                                                </TableCell>
                                                <TableCell className="text-[11px] text-[#7b848f]">
                                                    {t.payment}
                                                </TableCell>
                                                <TableCell>
                                                    <StatusPill
                                                        status={t.status}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-[12px] font-semibold text-[#16a249]">
                                                    {t.amount}
                                                </TableCell>
                                                <TableCell className="text-[11px] text-[#7b848f]">
                                                    {t.revenueFrom}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <button
                                                        type="button"
                                                        className="h-8 w-8 rounded-[10px] hover:bg-[#f6f8fa] inline-flex items-center justify-center"
                                                        onClick={(event) =>
                                                            event.stopPropagation()
                                                        }
                                                    >
                                                        <MoreHorizontal className="h-4 w-4 text-[#7b848f]" />
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="px-4 py-4 flex items-center justify-between text-[11px] text-[#7b848f]">
                                <div>Showing 1 to 100 list in 1 page</div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPage(Math.max(1, page - 1))
                                        }
                                        className="h-8 w-8 rounded-full bg-[#f6f8fa] flex items-center justify-center"
                                    >
                                        <span className="text-[#7b848f]">
                                            ‹
                                        </span>
                                    </button>
                                    {[1, 2, 3, 4, 5].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPage(p)}
                                            className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                                page === p
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
                                            setPage(Math.min(5, page + 1))
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
            {receiptOpen ? (
                <div className="fixed inset-0 z-[120] flex items-center justify-end">
                    <div
                        className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${
                            receiptActive ? "opacity-100" : "opacity-0"
                        }`}
                        onClick={closeReceipt}
                    />
                    <div
                        className={`relative h-full w-[880px] max-w-[90vw] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition-transform duration-200 ${
                            receiptActive ? "translate-x-0" : "translate-x-full"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-full flex flex-col">
                            <div className="h-[70px] px-6 flex items-center justify-between border-b border-[#edf1f3]">
                                <div className="text-[18px] font-semibold text-[#222f36]">
                                    Receipt
                                </div>
                                <button
                                    type="button"
                                    onClick={closeReceipt}
                                    className="h-9 w-9 rounded-full hover:bg-[#f6f8fa] flex items-center justify-center"
                                >
                                    <X className="h-4 w-4 text-[#7b848f]" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src="/figmaAssets/2-jpg.png"
                                            alt="user"
                                            className="h-12 w-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <div className="text-[16px] font-semibold text-[#222f36]">
                                                {receiptDetails.name}
                                            </div>
                                            <div className="text-[12px] text-[#7b848f]">
                                                {receiptDetails.handle}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-7">
                                        <div>
                                            <div className="text-[11px] text-[#7b848f]">
                                                Status
                                            </div>
                                            <span className="inline-flex items-center h-6 px-3 rounded-full bg-[#eaf7ef] text-[#16a249] text-[11px] font-medium">
                                                {receiptDetails.status}
                                            </span>
                                        </div>
                                        <div className="text-[29px] font-semibold text-[#62a230]">
                                            {receiptDetails.amount}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between space-x-34 items-center align-center w-[840px]">
                                    <div className="mt-5 text-[12px] text-[#7b848f]">
                                        {receiptDetails.description}
                                    </div>

                                    <div className="mt-4 flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            className="h-9 rounded-full border-[#e5e7eb] text-[#62a230] bg-[#f3f8ee] hover:bg-[#f3f8ee]"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Button>
                                        <Button className="h-9 rounded-full bg-[#62a230] text-white">
                                            <Printer className="h-4 w-4 mr-2" />
                                            Print Doc
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-6 grid grid-cols-2 gap-4 text-[12px] text-[#7b848f]">
                                    <div>
                                        <div>Payment Method</div>
                                        <div className="mt-1 text-[#222f36] font-medium text-lg">
                                            {receiptDetails.paymentMethod}
                                        </div>
                                    </div>
                                    <div>
                                        <div>Payment date</div>
                                        <div className="mt-1 text-[#222f36] font-medium text-md">
                                            {receiptDetails.paymentDate}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 border-t border-[#edf1f3] pt-4">
                                    <div className="grid grid-cols-[1fr_80px_100px] text-[11px] text-[#9aa3af] bg-[#f3f8ee] p-4 rounded-md">
                                        <div className="font-medium text-sm">
                                            Payment for
                                        </div>
                                        <div className="text-center">
                                            QUANITY
                                        </div>
                                        <div className="text-right">AMOUNT</div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-[1fr_80px_100px] text-[12px] text-[#222f36]">
                                        <div>
                                            <div className="font-medium text-sm ">
                                                {receiptDetails.item}
                                            </div>
                                            <div className="mt-1 text-[11px] text-[#7b848f]">
                                                {receiptDetails.itemDesc}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            {receiptDetails.qty}
                                        </div>
                                        <div className="text-right">
                                            {receiptDetails.total}
                                        </div>
                                    </div>
                                    <div className="mt-8 flex items-center justify-end text-[12px] text-[#7b848f]">
                                        <span className="mr-6">TOTAL DUE</span>
                                        <span className="text-[#222f36] font-semibold">
                                            {receiptDetails.total}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
            {editPlanOpen ? (
                <div className="fixed inset-0 z-[130] flex items-center justify-center">
                    <div
                        className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${
                            editPlanActive ? "opacity-100" : "opacity-0"
                        }`}
                        onClick={closeEditPlan}
                    />
                    <div
                        className={`relative w-[880px] max-w-[95vw] rounded-[20px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.2)] transition-all duration-200 ${
                            editPlanActive
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-95"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-10 pt-8 pb-9">
                            <div className="flex items-center justify-between">
                                <div className="text-[20px] font-semibold text-[#222f36]">
                                    Edit Plan
                                </div>
                                <div className="flex items-center gap-4 text-[12px] text-[#7b848f]">
                                    <button
                                        type="button"
                                        className="h-10 w-10 rounded-full bg-[#62a230] text-white flex items-center justify-center"
                                    >
                                        +
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeEditPlan}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="text-[16px]">←</span>
                                        Back
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="rounded-[14px] border border-[#edf1f3] p-6">
                                    <input
                                        value={planName}
                                        onChange={(e) =>
                                            setPlanName(e.target.value)
                                        }
                                        placeholder="Plan Name"
                                        className="h-11 w-full rounded-[10px] border border-[#e5e7eb] bg-white px-4 text-[12px] text-[#7b848f]"
                                    />
                                    <input
                                        value={planPrice}
                                        onChange={(e) =>
                                            setPlanPrice(e.target.value)
                                        }
                                        placeholder="Price"
                                        className="mt-4 h-11 w-full rounded-[10px] border border-[#e5e7eb] bg-white px-4 text-[12px] text-[#7b848f]"
                                    />
                                </div>
                                <div className="rounded-[14px] border border-[#edf1f3] p-6">
                                    <button
                                        type="button"
                                        className="h-10 w-10 rounded-full bg-[#62a230] text-white flex items-center justify-center"
                                    >
                                        +
                                    </button>
                                    <div className="mt-4 space-y-3">
                                        {planFeatures.map((feature, index) => (
                                            <input
                                                key={index}
                                                value={feature}
                                                onChange={(e) => {
                                                    const next = [
                                                        ...planFeatures,
                                                    ];
                                                    next[index] =
                                                        e.target.value;
                                                    setPlanFeatures(next);
                                                }}
                                                placeholder={`Feature ${index + 1}`}
                                                className="h-11 w-full rounded-[10px] border border-[#e5e7eb] bg-white px-4 text-[12px] text-[#7b848f]"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <Button className="h-11 w-[160px] rounded-[10px] bg-[#62a230] text-white">
                                    Update
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
