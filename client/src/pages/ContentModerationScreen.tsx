import { useMemo, useState } from "react";
import {
    Bell,
    EyeOff,
    ShieldAlert,
    TriangleAlert,
    Trash2,
    ArrowUpRight,
    CheckCircle2,
    Settings as SettingsIcon,
} from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

type ModerationCategory = "all" | "fake" | "spam" | "scam" | "abuse";

type Severity = "high" | "medium" | "low";

type ModerationItem = {
    id: string;
    vendor: string;
    category: Exclude<ModerationCategory, "all">;
    postId: string;
    severity: Severity;
    reports: number;
    timestamp: string;
    excerpt: string;
};

const SEED: ModerationItem[] = [
    {
        id: "m-1",
        vendor: "QuickMart Store",
        category: "fake",
        postId: "POST-89234",
        severity: "high",
        reports: 8,
        timestamp: "2024-12-29 08:45",
        excerpt: "50% off iPhone 15 Pro Max - Receipt attached",
    },
    {
        id: "m-2",
        vendor: "DealZone Express",
        category: "spam",
        postId: "POST-88199",
        severity: "medium",
        reports: 3,
        timestamp: "2024-12-29 08:41",
        excerpt: "BUY NOW!! LIMITED TIME OFFER!!!",
    },
    {
        id: "m-3",
        vendor: "LuxuryBrands Hub",
        category: "scam",
        postId: "POST-89156",
        severity: "high",
        reports: 12,
        timestamp: "2024-12-29 08:12",
        excerpt: "Authentic Rolex watch - Only $99",
    },
    {
        id: "m-4",
        vendor: "TechWorld Shop",
        category: "abuse",
        postId: "POST-89134",
        severity: "low",
        reports: 2,
        timestamp: "2024-12-29 07:58",
        excerpt: "Customer complaint response",
    },
    {
        id: "m-5",
        vendor: "SportGear Pro",
        category: "fake",
        postId: "POST-89098",
        severity: "medium",
        reports: 4,
        timestamp: "2024-12-29 07:31",
        excerpt: "Nike Air Jordan - Receipt from authorized dealer",
    },
];

function severityStyles(sev: Severity) {
    if (sev === "high") {
        return {
            pill: "bg-[#ffe7e7] text-[#ef4343]",
            border: "border-[#ef4343]",
            bg: "bg-[linear-gradient(90deg,rgba(239,67,67,0.10)_0%,rgba(239,67,67,0.02)_100%)]",
            header: "bg-[#fde6e6] border-[#f1d1d1]",
            label: "High",
        };
    }
    if (sev === "medium") {
        return {
            pill: "bg-[#fff0d6] text-[#f59f0a]",
            border: "border-[#f59f0a]",
            bg: "bg-[linear-gradient(90deg,rgba(245,159,10,0.12)_0%,rgba(245,159,10,0.02)_100%)]",
            header: "bg-[#fff2df] border-[#f0ddc0]",
            label: "Medium",
        };
    }
    return {
        pill: "bg-[#e9f0ff] text-[#2b73f7]",
        border: "border-[#2b73f7]",
        bg: "bg-[linear-gradient(90deg,rgba(43,115,247,0.12)_0%,rgba(43,115,247,0.02)_100%)]",
        header: "bg-[#e9f3ff] border-[#d7e7ff]",
        label: "Low",
    };
}

export const ContentModerationScreen = (): JSX.Element => {
    const { toast } = useToast();

    const [category, setCategory] = useState<ModerationCategory>("all");
    const [query, setQuery] = useState("");
    const [items, setItems] = useState<ModerationItem[]>(SEED);
    const [selectedId, setSelectedId] = useState<string>(SEED[0]?.id);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return items
            .filter((i) => (category === "all" ? true : i.category === category))
            .filter((i) => {
                if (!q) return true;
                return (
                    i.vendor.toLowerCase().includes(q) ||
                    i.postId.toLowerCase().includes(q)
                );
            });
    }, [category, items, query]);

    const selected = useMemo(() => {
        const byId = items.find((i) => i.id === selectedId);
        if (byId) return byId;
        return filtered[0] ?? items[0];
    }, [filtered, items, selectedId]);

    const handleAction = (action: string) => {
        if (!selected) return;
        toast({ title: action, description: `${selected.postId} • ${selected.vendor}` });
    };

    const handleRemove = () => {
        if (!selected) return;
        setItems((prev) => prev.filter((x) => x.id !== selected.id));
        toast({ title: "Removed Post", description: selected.postId });
        setTimeout(() => {
            setSelectedId((prev) => {
                if (prev !== selected.id) return prev;
                const next = filtered.find((x) => x.id !== selected.id);
                return next?.id ?? "";
            });
        }, 0);
    };

    const tabs = useMemo(
        () =>
            [
                { value: "all" as const, label: "All" },
                { value: "fake" as const, label: "Fake Receipt" },
                { value: "spam" as const, label: "Spam" },
                { value: "scam" as const, label: "Scam" },
                { value: "abuse" as const, label: "Abuse" },
            ],
        [],
    );

    return (
        <div className="bg-[#F5F6FA] w-full h-screen overflow-hidden">
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
                                    <ShieldAlert className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="p-0 bg-transparent border-0"
                            >
                                <Sidebar className="w-[280px]" variant="drawer" />
                            </SheetContent>
                        </Sheet>
                        <div className="text-[#222f36] font-semibold text-lg">
                            Content Moderation
                        </div>
                        <div className="w-10" />
                    </div>

                    <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full">
                        <div className="flex items-center gap-3.5">
                            <h1 className="[font-family:'Poppins',Helvetica] font-semibold text-[#222f36] text-2xl tracking-[0] leading-[33.6px] whitespace-nowrap">
                                Content Moderation
                            </h1>
                            <div className="flex items-center gap-[13px]">
                                <div className="w-px h-[19.5px] bg-[#7b848f] opacity-30" />
                                <p className="[font-family:'Poppins',Helvetica] font-normal text-[#7b848f] text-xs tracking-[0] leading-[18px]">
                                    Review and moderate flagged content
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-[19px]">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="w-[42px] h-[34px] flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors relative">
                                        <Bell className="w-5 h-5 text-[#7b848f]" />
                                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64">
                                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-sm">
                                                New flagged post
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Moderation queue updated
                                            </span>
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                                        <Avatar className="w-7 h-7 border border-gray-100">
                                            <AvatarImage src="/figmaAssets/2-jpg.png" />
                                            <AvatarFallback>MJ</AvatarFallback>
                                        </Avatar>
                                        <span className="[font-family:'Poppins',Helvetica] font-medium text-[#7b848f] text-[13.6px] tracking-[0] leading-[13.6px] whitespace-nowrap">
                                            Mr. Jack
                                        </span>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => (window.location.href = "/profile")}
                                    >
                                        Profile Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                        onClick={() => (window.location.href = "/auth")}
                                    >
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <button
                                onClick={() => (window.location.href = "/settings")}
                                className="w-[42px] h-[34px] flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                            >
                                <SettingsIcon className="w-5 h-5 text-[#7b848f]" />
                            </button>
                        </div>
                    </header>

                    <div className="w-full flex flex-col lg:flex-row items-stretch gap-3">
                        <div className="flex-1">
                            <div className="relative w-full">
                                <span className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#7b848f] opacity-60">
                                    <ShieldAlert className="w-4 h-4" />
                                </span>
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by vendor or post ID..."
                                    className="h-[38px] pl-[44px] pr-[17px] bg-white rounded-[10px] border border-[#edf1f3] [font-family:'Poppins',Helvetica] font-normal text-[#222f36] text-sm focus-visible:ring-emerald-500"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                            {tabs.map((t) => {
                                const active = category === t.value;
                                return (
                                    <button
                                        key={t.value}
                                        type="button"
                                        onClick={() => setCategory(t.value)}
                                        className={
                                            "h-[30px] rounded-[8px] px-3 text-[12px] font-medium transition-colors border " +
                                            (active
                                                ? "bg-[#62a230] border-[#62a230] text-white"
                                                : "bg-transparent border-transparent text-[#6b7681] hover:bg-white/70")
                                        }
                                    >
                                        {t.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-4">
                        <div className="space-y-3">
                            {filtered.map((it) => {
                                const s = severityStyles(it.severity);
                                const active = selected?.id === it.id;
                                return (
                                    <button
                                        key={it.id}
                                        type="button"
                                        onClick={() => setSelectedId(it.id)}
                                        className="w-full text-left"
                                    >
                                        <Card
                                            className={
                                                "rounded-[14px] border border-[#edf1f3] bg-white shadow-[0px_1px_3px_#00000005] overflow-hidden " +
                                                (active
                                                    ? "ring-2 ring-[#62a230]/30"
                                                    : "")
                                            }
                                        >
                                            <div
                                                className={
                                                    "border-l-[5px] " +
                                                    s.border +
                                                    " " +
                                                    s.bg +
                                                    " px-4 py-3"
                                                }
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={
                                                                "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.6px] bg-white/80 border border-white/80 " +
                                                                (it.severity === "high"
                                                                    ? "text-[#ef4343]"
                                                                    : it.severity ===
                                                                        "medium"
                                                                      ? "text-[#f59f0a]"
                                                                      : "text-[#2b73f7]")
                                                            }
                                                        >
                                                            {s.label}
                                                        </span>
                                                    </div>
                                                    <div className="text-[11px] text-[#7b848f] font-medium">
                                                        {it.reports} reports
                                                    </div>
                                                </div>

                                                <div className="mt-2 text-[13px] font-semibold text-[#222f36] leading-[18px]">
                                                    {it.vendor}
                                                </div>

                                                <div className="mt-1 text-[11px] text-[#7b848f]">
                                                    {it.category === "fake"
                                                        ? "Fake Receipt"
                                                        : it.category === "spam"
                                                          ? "Spam"
                                                          : it.category === "scam"
                                                            ? "Scam"
                                                            : "Abuse"}
                                                    <span className="mx-1">•</span>
                                                    {it.postId}
                                                </div>

                                                <div className="mt-2 rounded-[10px] bg-white/70 border border-white/70 px-3 py-2 text-[11px] text-[#222f36]">
                                                    {it.excerpt}
                                                </div>
                                            </div>
                                        </Card>
                                    </button>
                                );
                            })}

                            {filtered.length === 0 ? (
                                <div className="text-sm text-[#7b848f] px-2">
                                    No flagged posts match your filters.
                                </div>
                            ) : null}
                        </div>

                        <div>
                            <Card className="rounded-[16px] border-0 bg-white shadow-[0px_1px_3px_#00000005,0px_6px_10px_#b1b1b114] overflow-hidden">
                                {selected ? (
                                    <div>
                                        {(() => {
                                            const s = severityStyles(
                                                selected.severity,
                                            );
                                            return (
                                                <div
                                                    className={
                                                        "px-5 sm:px-6 py-5 border-b " +
                                                        s.header
                                                    }
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={
                                                                        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.6px] bg-white/80 border border-white/80 " +
                                                                        (selected.severity ===
                                                                        "high"
                                                                            ? "text-[#ef4343]"
                                                                            : selected.severity ===
                                                                                "medium"
                                                                              ? "text-[#f59f0a]"
                                                                              : "text-[#2b73f7]")
                                                                    }
                                                                >
                                                                    {selected.severity ===
                                                                    "high" ? (
                                                                        <TriangleAlert className="w-3.5 h-3.5" />
                                                                    ) : selected.severity ===
                                                                        "medium" ? (
                                                                        <TriangleAlert className="w-3.5 h-3.5" />
                                                                    ) : (
                                                                        <TriangleAlert className="w-3.5 h-3.5" />
                                                                    )}
                                                                    {s.label} Severity
                                                                </span>
                                                                <span className="text-[10px] font-semibold tracking-[0.6px] text-[#7b848f]">
                                                                    {selected.postId}
                                                                </span>
                                                            </div>

                                                            <div className="mt-3 text-[16px] font-semibold text-[#222f36]">
                                                                {selected.vendor}
                                                            </div>

                                                            <div className="mt-2 text-[11px] text-[#7b848f]">
                                                                {selected.category ===
                                                                "fake"
                                                                    ? "Fake Receipt"
                                                                    : selected.category ===
                                                                        "spam"
                                                                      ? "Spam"
                                                                      : selected.category ===
                                                                            "scam"
                                                                        ? "Scam"
                                                                        : "Abuse"}
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <div className="text-[#ef4343] text-[18px] font-semibold leading-[18px]">
                                                                {selected.reports}
                                                            </div>
                                                            <div className="text-[11px] text-[#7b848f]">
                                                                Reports
                                                            </div>
                                                            <div className="mt-3 text-[11px] text-[#7b848f]">
                                                                {selected.timestamp}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        <div className="p-5 sm:p-6">
                                            <div className="flex items-center gap-2 text-[#222f36] font-semibold text-[13px]">
                                                <CheckCircle2 className="w-4 h-4 text-[#62a230]" />
                                                Post Content
                                            </div>

                                            <div className="mt-3 rounded-[10px] border border-[#edf1f3] bg-white px-4 py-3 text-[12px] text-[#222f36]">
                                                {selected.excerpt}
                                            </div>

                                            <div className="mt-6 text-[#222f36] font-semibold text-[13px]">
                                                Moderation Actions
                                            </div>

                                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <Button
                                                    onClick={() =>
                                                        handleAction("Hide Post")
                                                    }
                                                    variant="outline"
                                                    className="h-10 rounded-[10px] bg-[#eef2f1] border-[#eef2f1] text-[#222f36]"
                                                >
                                                    <EyeOff className="w-4 h-4 mr-2" />
                                                    Hide Post
                                                </Button>

                                                <Button
                                                    onClick={handleRemove}
                                                    className="h-10 rounded-[10px] bg-[#ef4343] hover:bg-[#d83a3a] text-white"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Remove Post
                                                </Button>

                                                <Button
                                                    onClick={() =>
                                                        handleAction("Warn Vendor")
                                                    }
                                                    className="h-10 rounded-[10px] bg-[#f59f0a] hover:bg-[#de8d07] text-white"
                                                >
                                                    <TriangleAlert className="w-4 h-4 mr-2" />
                                                    Warn Vendor
                                                </Button>

                                                <Button
                                                    onClick={() =>
                                                        handleAction(
                                                            "Escalate Case",
                                                        )
                                                    }
                                                    variant="outline"
                                                    className="h-10 rounded-[10px] bg-white border border-[#dfe6e1] text-[#222f36]"
                                                >
                                                    <ArrowUpRight className="w-4 h-4 mr-2" />
                                                    Escalate Case
                                                </Button>

                                                <Button
                                                    onClick={() =>
                                                        handleAction(
                                                            "Dismiss - No Violation",
                                                        )
                                                    }
                                                    className="h-10 rounded-[10px] md:col-span-2 bg-[#16a249] hover:bg-[#138a3f] text-white"
                                                >
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    Dismiss - No Violation
                                                </Button>
                                            </div>

                                            <div className="mt-4 text-[10px] text-[#b0b6bf]">
                                                AI recommendations are advisory only. All enforcement actions require admin confirmation.
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 text-sm text-[#7b848f]">
                                        No post selected.
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
