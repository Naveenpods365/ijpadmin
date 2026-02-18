import { useEffect, useRef, useState } from "react";
import { Bell, Camera, ChevronRight, Lock, Settings, User } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const profileTabs = [
    { label: "Profile Setting", icon: User },
    { label: "Notification Setting", icon: Bell },
    { label: "Change Password", icon: Lock },
] as const;

const notificationItems = [
    {
        id: "critical",
        label: "Critical System Alerts",
        subtitle: "Email + Slack + SM...",
        enabled: true,
    },
    {
        id: "fraud",
        label: "Fraud Detection Alerts",
        subtitle: "Email + Slack",
        enabled: true,
    },
    {
        id: "fraud-2",
        label: "Fraud Detection Alerts",
        subtitle: "Email + Slack",
        enabled: true,
    },
    {
        id: "moderation",
        label: "High-priority Moderation",
        subtitle: "Email + Slack",
        enabled: true,
    },
    {
        id: "daily",
        label: "Daily Summary",
        subtitle: "Email + Slack",
        enabled: true,
    },
] as const;

export function ProfileScreen() {
    const [activeTab, setActiveTab] = useState<string>(profileTabs[0].label);
    const [firstName, setFirstName] = useState("Rupali");
    const [lastName, setLastName] = useState("Nandiya");
    const [email, setEmail] = useState("RupaliNandiya@gmail.com");
    const [notificationSettings, setNotificationSettings] = useState<
        Record<string, boolean>
    >(() =>
        Object.fromEntries(
            notificationItems.map((item) => [item.id, item.enabled]),
        ),
    );
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordStep, setPasswordStep] = useState<"form" | "verify">("form");
    const [otpValues, setOtpValues] = useState(["", "", "", "", ""]);
    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        if (activeTab !== "Change Password") {
            setPasswordStep("form");
        }
    }, [activeTab]);

    const toggleNotification = (id: string) => {
        setNotificationSettings((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;
        setOtpValues((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
        if (value && otpRefs.current[index + 1]) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (
        index: number,
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === "Backspace" && !otpValues[index]) {
            otpRefs.current[index - 1]?.focus();
        }
    };

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
                                    Profile
                                </h1>
                                <span className="text-[#c3c7cd]">|</span>
                                <p className="text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                    Configure platform settings
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

                    <Card className="mt-4 rounded-[16px] border-0 bg-white shadow-sm overflow-hidden">
                        <div className="relative h-[140px]">
                            <img
                                src="/figmaAssets/profileheader.png"
                                alt="Profile header"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0" />
                        </div>
                        <div className="relative px-6 pb-6 pt-10">
                            <div className="absolute left-6 -top-12 h-24 w-24 rounded-full border-4 border-white overflow-hidden shadow-lg">
                                <img
                                    src="/figmaAssets/2-jpg.png"
                                    alt="Kevin Gilbert"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="pl-28">
                                <div className="text-[18px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                    Kevin Gilbert
                                </div>
                                <div className="text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                    Admin
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="mt-5 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 h-[60vh]">
                        <Card className="rounded-[16px] border-0 bg-white shadow-sm h-full">
                            <div className="p-4 flex flex-col gap-1 h-full">
                                {profileTabs.map((tab, index) => {
                                    const isActive = activeTab === tab.label;
                                    return (
                                        <button
                                            key={tab.label}
                                            type="button"
                                            onClick={() =>
                                                setActiveTab(tab.label)
                                            }
                                            className={`w-full flex items-center justify-between px-4 py-4 text-[12px] font-medium transition-all ${
                                                index !== profileTabs.length - 1
                                                    ? "border-b border-[#eef1f4]"
                                                    : ""
                                            } ${
                                                isActive
                                                    ? "bg-[#eff7ea] text-[#62a230]"
                                                    : "bg-white text-[#222f36]"
                                            }`}
                                        >
                                            <span className="flex items-center gap-3">
                                                {tab.label}
                                            </span>
                                            <ChevronRight
                                                className={`h-4 w-4 ${
                                                    isActive
                                                        ? "text-[#62a230]"
                                                        : "text-[#7b848f]"
                                                }`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </Card>

                        <Card className="rounded-[16px] border-0 bg-white shadow-sm">
                            {activeTab === "Profile Setting" ? (
                                <div className="p-5">
                                    <div className="rounded-[14px] bg-[#f7f7f7] p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                                Profile Details
                                            </div>
                                            <Button className="h-9 px-6 rounded-[8px] bg-[#62a230] text-white text-[12px] font-semibold">
                                                Save changes
                                            </Button>
                                        </div>

                                        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="relative h-16 w-16">
                                                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                                                        <img
                                                            src="/figmaAssets/2-jpg.png"
                                                            alt="Profile"
                                                            className="h-14 w-14 rounded-full object-cover"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white border border-[#e5e7eb] flex items-center justify-center text-[#62a230]"
                                                    >
                                                        <Camera className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <div className="text-[10px] text-[#7b848f]">
                                                    Profile Picture
                                                </div>
                                            </div>
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-[11px] text-[#9aa3af]">
                                                        First Name
                                                    </div>
                                                    <input
                                                        value={firstName}
                                                        onChange={(e) =>
                                                            setFirstName(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-2 h-9 w-full rounded-[8px] border border-[#e5e7eb] bg-white px-3 text-[12px] text-[#222f36] focus:outline-none focus:ring-2 focus:ring-[#eaf7ef]"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="text-[11px] text-[#9aa3af]">
                                                        Last Name
                                                    </div>
                                                    <input
                                                        value={lastName}
                                                        onChange={(e) =>
                                                            setLastName(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-2 h-9 w-full rounded-[8px] border border-[#e5e7eb] bg-white px-3 text-[12px] text-[#222f36] focus:outline-none focus:ring-2 focus:ring-[#eaf7ef]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 rounded-[14px] bg-[#f7f7f7] p-4">
                                        <div className="text-[13px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                            Email
                                        </div>
                                        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <input
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                className="h-9 w-full md:max-w-[320px] rounded-[8px] border border-[#e5e7eb] bg-white px-3 text-[12px] text-[#222f36] focus:outline-none focus:ring-2 focus:ring-[#eaf7ef]"
                                            />
                                            <Button className="h-9 px-6 rounded-[8px] bg-[#62a230] text-white text-[12px] font-semibold">
                                                Update Email
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {activeTab === "Notification Setting" ? (
                                <div className="p-6">
                                    <div className="max-w-[920px] mx-auto space-y-4">
                                        {notificationItems.map((item) => {
                                            const enabled =
                                                notificationSettings[item.id];
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between rounded-[12px] bg-[#f7f7f7] px-5 py-4"
                                                >
                                                    <div>
                                                        <div className="text-[12px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                                            {item.label}
                                                        </div>
                                                        <div className="text-[10px] text-[#9aa3af] [font-family:'Poppins',Helvetica]">
                                                            {item.subtitle}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleNotification(
                                                                item.id,
                                                            )
                                                        }
                                                        className={`relative h-6 w-12 rounded-full transition-colors ${
                                                            enabled
                                                                ? "bg-[#e6f0dc]"
                                                                : "bg-[#eef1f4]"
                                                        }`}
                                                    >
                                                        <span
                                                            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full transition-transform duration-200 shadow-sm ${
                                                                enabled
                                                                    ? "translate-x-6 bg-[#62a230]"
                                                                    : "translate-x-0 bg-white border border-[#cdd4dc]"
                                                            }`}
                                                        />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : null}

                            {activeTab === "Change Password" ? (
                                <div className="p-6">
                                    <div className="max-w-[360px] mx-auto flex flex-col gap-6 align-items-center ">
                                        {passwordStep === "form" ? (
                                            <>
                                                <div className="text-[26px] font-regular text-[#222f36] text-left [font-family:'Poppins',Helvetica]">
                                                    Change Password
                                                </div>
                                                <p className="mt-1 text-[12px] text-[#9aa3af] text-left leading-4">
                                                    Create a new password with
                                                    at least 8 characters to
                                                    secure your account.
                                                </p>
                                                <div className="mt-4 space-y-3">
                                                    <div>
                                                        <div className="text-[13px] text-[#111]">
                                                            Old password
                                                        </div>
                                                        <input
                                                            type="password"
                                                            value={
                                                                currentPassword
                                                            }
                                                            onChange={(e) =>
                                                                setCurrentPassword(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="mt-2 h-9 w-full rounded-[8px] border border-[#e5e7eb] bg-[#f7f7f7] px-3 text-[12px] text-[#222f36] focus:outline-none focus:ring-2 focus:ring-[#eaf7ef]"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-[13px] text-[#111]">
                                                            New Password
                                                        </div>
                                                        <input
                                                            type="password"
                                                            value={newPassword}
                                                            onChange={(e) =>
                                                                setNewPassword(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="mt-2 h-9 w-full rounded-[8px] border border-[#e5e7eb] bg-[#f7f7f7] px-3 text-[12px] text-[#222f36] focus:outline-none focus:ring-2 focus:ring-[#eaf7ef]"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-[13px] text-[#111]">
                                                            Confirm Password
                                                        </div>
                                                        <input
                                                            type="password"
                                                            value={
                                                                confirmPassword
                                                            }
                                                            onChange={(e) =>
                                                                setConfirmPassword(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="mt-2 h-9 w-full rounded-[8px] border border-[#e5e7eb] bg-[#f7f7f7] px-3 text-[12px] text-[#222f36] focus:outline-none focus:ring-2 focus:ring-[#eaf7ef]"
                                                        />
                                                    </div>
                                                    <Button
                                                        onClick={() => {
                                                            setPasswordStep(
                                                                "verify",
                                                            );
                                                            setOtpValues([
                                                                "",
                                                                "",
                                                                "",
                                                                "",
                                                                "",
                                                            ]);
                                                        }}
                                                        className="h-9 w-full rounded-[8px] bg-[#62a230] text-white text-[12px] font-semibold"
                                                    >
                                                        Change
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="text-[26px] font-semibold text-[#222f36] text-left [font-family:'Poppins',Helvetica]">
                                                    Verification
                                                </div>
                                                <p className="text-[12px] text-[#9aa3af] text-left leading-4">
                                                    Please enter the OTP sent to
                                                    your registered mobile
                                                    number or email id
                                                    John*****@mail.com
                                                </p>
                                                <div className="mt-4 text-[11px] text-[#9aa3af]">
                                                    OTP
                                                </div>
                                                <div className="mt-2 flex items-center justify-left gap-2">
                                                    {otpValues.map(
                                                        (value, index) => (
                                                            <input
                                                                key={`otp-${index}`}
                                                                ref={(el) =>
                                                                    (otpRefs.current[
                                                                        index
                                                                    ] = el)
                                                                }
                                                                autoFocus={
                                                                    index === 0
                                                                }
                                                                value={value}
                                                                onChange={(e) =>
                                                                    handleOtpChange(
                                                                        index,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                onKeyDown={(
                                                                    e,
                                                                ) =>
                                                                    handleOtpKeyDown(
                                                                        index,
                                                                        e,
                                                                    )
                                                                }
                                                                maxLength={1}
                                                                className={`h-10 w-10 rounded-[8px] bg-[#f7f7f7] border text-center text-[12px] ${
                                                                    index === 0
                                                                        ? "border-[#62a230]"
                                                                        : "border-[#e5e7eb]"
                                                                }`}
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                                <Button className="mt-4 h-9 w-full rounded-[8px] bg-[#62a230] text-white text-[12px] font-semibold">
                                                    Submit
                                                </Button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPasswordStep("form");
                                                        setOtpValues([
                                                            "",
                                                            "",
                                                            "",
                                                            "",
                                                            "",
                                                        ]);
                                                    }}
                                                    className="mt-3 w-full text-[11px] text-[#7b848f]"
                                                >
                                                    Back
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
