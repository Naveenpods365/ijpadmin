import { useState } from "react";
import { Bell, Settings } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function PricingSettingsScreen() {
    const [sponsoredPrice, setSponsoredPrice] = useState("");
    const [adminFee, setAdminFee] = useState("");
    const [vendorFee, setVendorFee] = useState("");
    const [maxImages, setMaxImages] = useState("");
    const [commentLimit, setCommentLimit] = useState("");

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
                                    Settings
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

                    <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <Card className="rounded-[14px] border-0 bg-white shadow-sm">
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                            Sponsored Post Pricing
                                        </div>
                                        <div className="text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                            Set the price per day for sponsored posts
                                        </div>
                                    </div>
                                    <Button className="h-9 px-6 rounded-[8px] bg-[#62a230] text-white text-[12px] font-semibold">
                                        Save Settings
                                    </Button>
                                </div>
                                <div className="mt-4">
                                    <div className="text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        Price Per Day ($)
                                    </div>
                                    <input
                                        value={sponsoredPrice}
                                        onChange={(e) =>
                                            setSponsoredPrice(e.target.value)
                                        }
                                        className="mt-2 h-10 w-full rounded-[6px] border border-[#e5e7eb] bg-white px-3 text-[12px] text-[#222f36] [font-family:'Poppins',Helvetica] focus:outline-none focus:ring-2 focus:ring-[#eaf7ef]"
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card className="rounded-[14px] border-0 bg-white shadow-sm">
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                            Talk to Admin fee
                                        </div>
                                        <div className="text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                            Set the price for one Time chating
                                        </div>
                                    </div>
                                    <Button className="h-9 px-6 rounded-[8px] bg-[#62a230] text-white text-[12px] font-semibold">
                                        Save Settings
                                    </Button>
                                </div>
                                <div className="mt-4">
                                    <div className="text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        Price For Once
                                    </div>
                                    <input
                                        value={adminFee}
                                        onChange={(e) =>
                                            setAdminFee(e.target.value)
                                        }
                                        className="mt-2 h-10 w-full rounded-[6px] border border-[#e5e7eb] bg-white px-3 text-[12px] text-[#222f36] [font-family:'Poppins',Helvetica] focus:outline-none focus:ring-2 focus:ring-[#eaf7ef]"
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card className="rounded-[14px] border-0 bg-white shadow-sm">
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                            Vendor Posting Product Fee
                                        </div>
                                        <div className="text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                            Set the price per Post
                                        </div>
                                    </div>
                                    <Button className="h-9 px-6 rounded-[8px] bg-[#62a230] text-white text-[12px] font-semibold">
                                        Save Settings
                                    </Button>
                                </div>
                                <div className="mt-4">
                                    <div className="text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        Price Per Post ($)
                                    </div>
                                    <input
                                        value={vendorFee}
                                        onChange={(e) =>
                                            setVendorFee(e.target.value)
                                        }
                                        className="mt-2 h-10 w-full rounded-[6px] border border-[#e5e7eb] bg-white px-3 text-[12px] text-[#222f36] [font-family:'Poppins',Helvetica] focus:outline-none focus:ring-2 focus:ring-[#eaf7ef]"
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card className="rounded-[14px] border-0 bg-white shadow-sm">
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                            Platform Configuration
                                        </div>
                                        <div className="text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                            Additional platform settings
                                        </div>
                                    </div>
                                    <Button className="h-9 px-6 rounded-[8px] bg-[#62a230] text-white text-[12px] font-semibold">
                                        Save Settings
                                    </Button>
                                </div>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                            Maximum Images Per Post
                                        </div>
                                        <input
                                            value={maxImages}
                                            onChange={(e) =>
                                                setMaxImages(e.target.value)
                                            }
                                            className="mt-2 h-10 w-full rounded-[6px] border border-[#e5e7eb] bg-white px-3 text-[12px] text-[#222f36] [font-family:'Poppins',Helvetica] focus:outline-none focus:ring-2 focus:ring-[#eaf7ef]"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                            Comment Character Limit
                                        </div>
                                        <input
                                            value={commentLimit}
                                            onChange={(e) =>
                                                setCommentLimit(e.target.value)
                                            }
                                            className="mt-2 h-10 w-full rounded-[6px] border border-[#e5e7eb] bg-white px-3 text-[12px] text-[#222f36] [font-family:'Poppins',Helvetica] focus:outline-none focus:ring-2 focus:ring-[#eaf7ef]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
