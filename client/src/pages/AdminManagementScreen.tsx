import { useMemo, useState } from "react";
import {
    Bell,
    Check,
    ChevronDown,
    Clock,
    Mail,
    Plus,
    Search,
    Settings,
    UserRound,
    Trash2,
    X,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const adminTabs = ["Admin Users", "Audit Logs"] as const;

type AdminUser = {
    id: string;
    initials: string;
    name: string;
    email: string;
    role: "Super Admin" | "Support Admin" | "Finance Admin" | "Compliance Admin";
    status: "Online" | "Away" | "Offline";
    lastActive: string;
    twoFA: "Enabled" | "Disabled";
};

const adminUsers: AdminUser[] = [
    {
        id: "u1",
        initials: "SK",
        name: "Sarah Kim",
        email: "sarah.kim@ijustpaid.com",
        role: "Super Admin",
        status: "Online",
        lastActive: "Now",
        twoFA: "Enabled",
    },
    {
        id: "u2",
        initials: "MC",
        name: "Michael Chen",
        email: "m.chen@ijustpaid.com",
        role: "Support Admin",
        status: "Online",
        lastActive: "5 min ago",
        twoFA: "Enabled",
    },
    {
        id: "u3",
        initials: "ER",
        name: "Emily Rodriguez",
        email: "e.rodriguez@ijustpaid.com",
        role: "Finance Admin",
        status: "Online",
        lastActive: "12 min ago",
        twoFA: "Enabled",
    },
    {
        id: "u4",
        initials: "JW",
        name: "James Wilson",
        email: "j.wilson@ijustpaid.com",
        role: "Compliance Admin",
        status: "Away",
        lastActive: "1 hour ago",
        twoFA: "Enabled",
    },
    {
        id: "u5",
        initials: "LT",
        name: "Lisa Thompson",
        email: "l.thompson@ijustpaid.com",
        role: "Support Admin",
        status: "Offline",
        lastActive: "3 hours ago",
        twoFA: "Disabled",
    },
];

type AuditLog = {
    id: string;
    initials: string;
    name: string;
    action: string;
    target: string;
    time: string;
    tone: "danger" | "warning" | "info" | "success";
};

const auditLogs: AuditLog[] = [
    {
        id: "l1",
        initials: "SK",
        name: "Sarah Kim",
        action: "Vendor Suspended",
        target: "GadgetZone Plus",
        time: "2024-12-29 09:15",
        tone: "danger",
    },
    {
        id: "l2",
        initials: "MC",
        name: "Michael Chen",
        action: "User Warned",
        target: "alex_trader99",
        time: "2024-12-29 09:08",
        tone: "warning",
    },
    {
        id: "l3",
        initials: "ER",
        name: "Emily Rodriguez",
        action: "Refund Processed",
        target: "TXN-89231",
        time: "2024-12-29 08:58",
        tone: "info",
    },
    {
        id: "l4",
        initials: "SK",
        name: "Sarah Kim",
        action: "Post Removed",
        target: "POST-88934",
        time: "2024-12-29 08:45",
        tone: "danger",
    },
    {
        id: "l5",
        initials: "JW",
        name: "James Wilson",
        action: "Risk Score Updated",
        target: "AutoLux Parts",
        time: "2024-12-29 08:32",
        tone: "warning",
    },
    {
        id: "l6",
        initials: "MC",
        name: "Michael Chen",
        action: "User Banned",
        target: "fake_seller_xyz",
        time: "2024-12-29 08:18",
        tone: "danger",
    },
    {
        id: "l7",
        initials: "SK",
        name: "Sarah Kim",
        action: "Vendor Warned",
        target: "FashionHub Elite",
        time: "2024-12-29 08:05",
        tone: "warning",
    },
    {
        id: "l8",
        initials: "ER",
        name: "Emily Rodriguez",
        action: "Subscription Plan Updated",
        target: "Professional Plan",
        time: "2024-12-29 07:52",
        tone: "success",
    },
];

const roleStyles: Record<AdminUser["role"], string> = {
    "Super Admin": "bg-[#5ba82c] text-white",
    "Support Admin": "bg-[#e8f4ff] text-[#3b82f6]",
    "Finance Admin": "bg-[#eaf7ef] text-[#4d7c0f]",
    "Compliance Admin": "bg-[#fff3e0] text-[#f59f0a]",
};

const statusStyles: Record<AdminUser["status"], string> = {
    Online: "text-[#16a249]",
    Away: "text-[#f59f0a]",
    Offline: "text-[#6b7280]",
};

const auditTone: Record<AuditLog["tone"], string> = {
    danger: "bg-[#fee2e2] text-[#ef4444]",
    warning: "bg-[#fff4e5] text-[#f59f0a]",
    info: "bg-[#e0f2fe] text-[#0ea5e9]",
    success: "bg-[#dcfce7] text-[#16a249]",
};

const roleCards = [
    {
        title: "Super Admin",
        description: "Full platform access",
        accent: "border-[#62a230] bg-[#eff9f0]",
        tags: ["all"],
    },
    {
        title: "Support Admin",
        description: "Customer support operations",
        accent: "border-[#edf1f3]",
        tags: ["users", "vendors", "moderation", "reports"],
    },
    {
        title: "Finance Admin",
        description: "Financial operations",
        accent: "border-[#edf1f3]",
        tags: ["finance", "subscriptions", "reports"],
    },
    {
        title: "Compliance Admin",
        description: "Compliance and legal",
        accent: "border-[#edf1f3]",
        tags: ["moderation", "audit", "reports", "alerts"],
    },
] as const;

export function AdminManagementScreen() {
    const [activeTab, setActiveTab] = useState<(typeof adminTabs)[number]>(
        "Admin Users",
    );
    const [search, setSearch] = useState("");

    const filteredLogs = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return auditLogs;
        return auditLogs.filter((log) => {
            return (
                log.name.toLowerCase().includes(q) ||
                log.action.toLowerCase().includes(q) ||
                log.target.toLowerCase().includes(q)
            );
        });
    }, [search]);

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
                                    Admin Management
                                </h1>
                                <span className="text-[#c3c7cd]">|</span>
                                <p className="text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                    Manage administrator accounts and permissions
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

                    <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-2">
                            {adminTabs.map((tab) => {
                                const isActive = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setActiveTab(tab)}
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
                        {activeTab === "Audit Logs" ? (
                            <div className="relative w-full lg:w-[340px]">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa3af]" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by admin, action, or target..."
                                    className="h-9 w-full rounded-[6px] border border-[#edf1f3] bg-white pl-9 pr-3 text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica] focus:outline-none focus:ring-2 focus:ring-[#eaf7ef]"
                                />
                            </div>
                        ) : null}
                    </div>

                    {activeTab === "Admin Users" ? (
                        <>
                            <Card className="mt-4 rounded-[14px] border-0 bg-white shadow-sm">
                                <div className="p-5 border-b border-[#edf1f3] flex items-center justify-between">
                                    <div>
                                        <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                            Admin Users
                                        </div>
                                        <div className="text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                            {adminUsers.length} administrators
                                        </div>
                                    </div>
                                    <Button className="h-9 px-4 rounded-[8px] bg-[#62a230] text-white text-[12px] font-semibold flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Add Admin
                                    </Button>
                                </div>
                                <div className="px-2 pb-3">
                                    <div className="rounded-[12px] border border-[#edf1f3] overflow-hidden">
                                        <table className="w-full text-[11px]">
                                            <thead className="bg-[#f6f7f9]">
                                                <tr className="text-[#9aa3af]">
                                                    <th className="text-left font-medium px-4 py-3">Name</th>
                                                    <th className="text-left font-medium px-4 py-3">Email</th>
                                                    <th className="text-left font-medium px-4 py-3">Role</th>
                                                    <th className="text-left font-medium px-4 py-3">Status</th>
                                                    <th className="text-left font-medium px-4 py-3">Last Active</th>
                                                    <th className="text-left font-medium px-4 py-3">2FA</th>
                                                    <th className="text-center font-medium px-4 py-3">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {adminUsers.map((admin) => (
                                                    <tr
                                                        key={admin.id}
                                                        className="border-b border-[#f0f2f4]"
                                                    >
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-[10px] bg-[#62a230] text-white text-[11px] font-semibold flex items-center justify-center">
                                                                    {admin.initials}
                                                                </div>
                                                                <div className="text-[11px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                                                    {admin.name}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-[#7b848f]">
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="h-4 w-4 text-[#9aa3af]" />
                                                                {admin.email}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span
                                                                className={`inline-flex items-center h-6 px-3 rounded-full text-[10px] font-semibold ${roleStyles[admin.role]}`}
                                                            >
                                                                {admin.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2 text-[11px]">
                                                                <span
                                                                    className={`h-2 w-2 rounded-full ${
                                                                        admin.status === "Online"
                                                                            ? "bg-[#16a249]"
                                                                            : admin.status === "Away"
                                                                                ? "bg-[#f59f0a]"
                                                                                : "bg-[#9aa3af]"
                                                                    }`}
                                                                />
                                                                <span
                                                                    className={`font-medium ${statusStyles[admin.status]}`}
                                                                >
                                                                    {admin.status}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-[#7b848f]">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-[#9aa3af]" />
                                                                {admin.lastActive}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span
                                                                className={`inline-flex items-center h-6 px-3 rounded-full text-[10px] font-semibold gap-2 ${
                                                                    admin.twoFA === "Enabled"
                                                                        ? "bg-[#f3f8ee] text-[#62a230]"
                                                                        : "bg-[#fee2e2] text-[#ef4444]"
                                                                }`}
                                                            >
                                                                {admin.twoFA === "Enabled" ? (
                                                                    <Check className="h-3 w-3" />
                                                                ) : (
                                                                    <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                                                                )}
                                                                {admin.twoFA}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <div className="flex items-center justify-center gap-3">
                                                                <button
                                                                    type="button"
                                                                    className="h-8 w-8 rounded-[6px] border border-transparent hover:bg-[#f6f8fa] inline-flex items-center justify-center text-[#62a230]"
                                                                >
                                                                    <svg
                                                                        viewBox="0 0 24 24"
                                                                        className="h-4 w-4"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="2"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    >
                                                                        <path d="M12 20h9" />
                                                                        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="h-8 w-8 rounded-[6px] border border-transparent hover:bg-[#f6f8fa] inline-flex items-center justify-center text-[#ef4444]"
                                                                >
                                                                   <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Card>

                            <Card className="mt-5 rounded-[14px] border-0 bg-white shadow-sm">
                                <div className="p-5 border-b border-[#edf1f3]">
                                    <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                        Roles & Permissions
                                    </div>
                                    <div className="text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        Permission matrix for admin roles
                                    </div>
                                </div>
                                <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                    {roleCards.map((role) => (
                                        <div
                                            key={role.title}
                                            className={`rounded-[14px] border ${role.accent} p-4`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-[10px] bg-[#eef4ef] text-[#62a230] flex items-center justify-center">
                                                    <UserRound className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <div className="text-[12px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                                        {role.title}
                                                    </div>
                                                    <div className="text-[10px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                                        {role.description}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {role.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="inline-flex items-center h-6 px-3 rounded-full bg-[#f1f5f2] text-[#222f36] text-[10px] font-medium"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </>
                    ) : (
                        <Card className="mt-4 rounded-[14px] border-0 bg-white shadow-sm">
                            <div className="p-4">
                                <div className="space-y-3">
                                    {filteredLogs.map((log) => (
                                        <div
                                            key={log.id}
                                            className="flex items-center justify-between rounded-[12px] border border-[#edf1f3] bg-white px-4 py-4"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-[12px] bg-[#62a230] text-white text-[11px] font-semibold flex items-center justify-center">
                                                    {log.initials}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 text-[11px] text-[#222f36]">
                                                        <span className="font-semibold [font-family:'Poppins',Helvetica]">
                                                            {log.name}
                                                        </span>
                                                        <span
                                                            className={`inline-flex items-center h-5 px-2 rounded-full text-[10px] font-semibold ${auditTone[log.tone]}`}
                                                        >
                                                            {log.action}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] text-[#7b848f]">
                                                        Target: <span className="text-[#222f36]">{log.target}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] text-[#7b848f]">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-[#9aa3af]" />
                                                    {log.time}
                                                </div>
                                                <ChevronDown className="h-4 w-4 text-[#9aa3af]" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
