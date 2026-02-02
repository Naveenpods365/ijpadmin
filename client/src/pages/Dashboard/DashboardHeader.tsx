import { useState } from "react";
import { format } from "date-fns";
import { Bell, SearchIcon, Settings as SettingsIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader({
    title = "Dashboard",
    description,
    greeting,
    onSearch,
}: {
    title?: string;
    description?: string;
    greeting?: string;
    onSearch: (query: string) => void;
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const subtitle =
        description ??
        greeting ??
        "Hello , 👋 Jack Welcome to Ijustpaid dashboard";

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) onSearch(searchQuery.trim());
    };

    return (
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3.5">
                <h1 className="[font-family:'Poppins',Helvetica] font-semibold text-[#222f36] text-2xl tracking-[0] leading-[33.6px] whitespace-nowrap">
                    {title}
                </h1>
                <div className="flex items-center gap-[13px]">
                    <div className="w-px h-[19.5px] bg-[#7b848f] opacity-30" />
                    <p className="[font-family:'Poppins',Helvetica] font-normal text-[#7b848f] text-xs tracking-[0] leading-[18px]">
                        {subtitle}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-[19px]">
                <form
                    onSubmit={handleSearch}
                    className="relative w-full lg:w-[388px]"
                >
                    <SearchIcon className="absolute left-[17px] top-1/2 -translate-y-1/2 w-[15.61px] h-[15.61px] text-[#7b848f] opacity-50" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search For Anything"
                        className="h-[38px] pl-[45px] pr-[17px] bg-white rounded-[19px] border-[0.6px] border-[#7a838e] [font-family:'Poppins',Helvetica] font-normal text-[#222f36] text-sm focus-visible:ring-emerald-500"
                    />
                </form>

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
                                    New post created
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    John Doe created a new deal
                                </span>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <div className="flex flex-col gap-1">
                                <span className="font-medium text-sm">
                                    Payment received
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    Successful subscription update
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
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => (window.location.href = "/billing")}
                        >
                            Billing
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
    );
}
