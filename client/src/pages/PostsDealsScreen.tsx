import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Eye,
    Heart,
    Image as ImageIcon,
    Loader2,
    MessageCircle,
    MoreHorizontal,
    SearchIcon,
    Share2,
    ThumbsUp,
    X,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import {
    PostDetailPopup,
    type PostDetailData,
} from "@/components/PostDetailPopup";
import { PostInsightsPopup } from "@/components/PostInsightsPopup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { DashboardHeader } from "@/pages/Dashboard/DashboardHeader";
import { cn } from "@/lib/utils";
import { usePosts, useDeletePost } from "@/hooks/usePosts";
import type { Post } from "@/services/postService";
import { format } from "date-fns";

type PostType = "All" | "Regular" | "Sponsored" | "Group Buy";

const engagementStats = [
    {
        title: "Total Likes",
        value: "50 M",
        sub: "From last week",
        icon: "heart",
    },
    {
        title: "Comments",
        value: "800",
        sub: "From last week",
        icon: "comment",
    },
    {
        title: "Shares",
        value: "3.2K",
        sub: "From last week",
        icon: "share",
    },
];

const mostViewed = [
    { img: "/figmaAssets/component-6.png", views: "1.5 M" },
    { img: "/figmaAssets/group.png", views: "1.5 M" },
    { img: "/figmaAssets/group-2.png", views: "1.5 M" },
    { img: "/figmaAssets/group-3.png", views: "1.5 M" },
];

/** Map an API Post to the PostDetailData shape used by the popup */
function toPostDetailData(p: Post, idx: number): PostDetailData {
    return {
        id: idx,
        user: p.authorDetails?.name || "Unknown",
        userAvatar: p.authorDetails?.avatar || "/figmaAssets/ellipse-11.svg",
        post: p.title,
        postImg: p.thumbnail || "/figmaAssets/group-1.png",
        type: p.type,
        category: p.category,
        subCategory: p.subCategory || "—",
        startDate: p.dealStartDate
            ? format(new Date(p.dealStartDate), "dd-MM-yyyy")
            : "—",
        likes: p.engagement?.likes ?? 0,
        comments: p.engagement?.comments ?? 0,
        status: p.status === "ACTIVE" ? "Active" : p.status,
    };
}

type DeleteReason = "reason1" | "reason2" | "reason3" | "reason4" | "custom";

export const PostsDealsScreen = (): JSX.Element => {
    const [, setLocationPath] = useLocation();
    const [postType, setPostType] = useState<PostType>("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPost, setSelectedPost] = useState<PostDetailData | null>(
        null,
    );
    const [insightsPost, setInsightsPost] = useState<PostDetailData | null>(
        null,
    );
    const [showSponsoredForm, setShowSponsoredForm] = useState(false);

    // Delete dialog state
    const [deletePostId, setDeletePostId] = useState<string | null>(null);
    const [deletePostTitle, setDeletePostTitle] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDeleteReason, setShowDeleteReason] = useState(false);
    const [deleteReason, setDeleteReason] = useState<DeleteReason>("reason1");
    const [deleteCustomReason, setDeleteCustomReason] = useState("");

    // Track locally-deleted post IDs so they stay hidden even after server refetch
    const [deletedPostIds, setDeletedPostIds] = useState<Set<string>>(new Set());

    const deletePostMutation = useDeletePost();

    // Build API params
    const apiParams = useMemo(() => {
        const params: Record<string, unknown> = {
            page: currentPage,
            limit: 20,
        };
        if (postType !== "All") params.type = postType;
        if (searchQuery.trim()) params.search = searchQuery.trim();
        return params;
    }, [currentPage, postType, searchQuery]);

    const { data: postsResponse, isLoading } = usePosts(apiParams);

    const rawPosts = postsResponse?.data?.posts ?? [];
    const posts = rawPosts.filter((p: any) => !deletedPostIds.has(p._id));
    const pagination = postsResponse?.data?.pagination;
    const totalPages = pagination?.pages ?? 1;

    // Filter client-side for tab switching (API already filters by type, but
    // keep client-side filter as a fallback for the "All" case)
    const filteredPosts = useMemo(() => {
        if (postType === "All") return posts;
        return posts.filter((p) => p.type === postType);
    }, [postType, posts]);

    return (
        <div className="bg-[#F5F6FA] w-full h-screen overflow-hidden">
            <div className="hidden lg:block fixed inset-y-0 left-0 w-[312px] z-40">
                <Sidebar className="w-[280px]" variant="desktop" />
            </div>

            <main className="h-screen overflow-y-auto no-scrollbar lg:pl-[292px]">
                <div className="flex flex-col items-start gap-[18px] p-[16px] sm:p-[24px] overflow-x-hidden">
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
                            Posts & Deals
                        </div>
                        <div className="w-10" />
                    </div>

                    {!showSponsoredForm && (
                        <DashboardHeader
                            title="Posts & Deals"
                            description="Manage all user created posts and deals"
                            onSearch={() => {}}
                        />
                    )}

                    {showSponsoredForm ? (
                        <div className="w-[120vh] mt-36 ml-24">
                            <div
                                className="flex items-center gap-3 text-[#222f36] cursor-pointer"
                                onClick={() => setShowSponsoredForm(false)}
                            >
                                <button
                                    type="button"
                                    className="h-8 w-8 flex items-center justify-center text-[#7b848f] hover:text-[#222f36]"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <div className="text-[20px] font-semibold [font-family:'Poppins',Helvetica]">
                                    Create Sponsored post
                                </div>
                            </div>

                            <div className="mt-6 rounded-[18px] bg-[#D9D9D9] p-6 shadow-sm">
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                    <div className="space-y-4">
                                        <div className="text-[12px] text-[#7b848f]">
                                            Upload Product Images
                                        </div>
                                        <div className="h-[130px] rounded-[12px] border border-[#e5e7eb] bg-white flex flex-col items-center justify-center gap-2 text-[#9aa3af]">
                                            <ImageIcon className="h-7 w-7" />
                                            <span className="text-[12px]">
                                                Upload
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-[12px] text-[#7b848f]">
                                                Product Name
                                            </div>
                                            <Input
                                                placeholder="Enter Product Name"
                                                className="mt-2 h-10 rounded-[10px] bg-white border border-[#e5e7eb]"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-[12px] text-[#7b848f]">
                                                Category
                                            </div>
                                            <Select defaultValue="Category">
                                                <SelectTrigger className="mt-2 h-10 rounded-[10px] bg-white border border-[#e5e7eb]">
                                                    <SelectValue placeholder="Choose Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Category">
                                                        Choose Category
                                                    </SelectItem>
                                                    <SelectItem value="Electronics">
                                                        Electronics
                                                    </SelectItem>
                                                    <SelectItem value="Fashion">
                                                        Fashion
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="pt-2">
                                            <div className="text-[12px] text-[#7b848f]">
                                                Sale Man Image
                                            </div>
                                            <div className="mt-3 h-[90px] flex items-center justify-center">
                                                <div className="relative h-20 w-20 rounded-full bg-white border border-[#e5e7eb] flex items-center justify-center">
                                                    <img
                                                        src="/figmaAssets/ellipse-11.svg"
                                                        alt="sales"
                                                        className="h-14 w-14"
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white border border-[#e5e7eb] flex items-center justify-center text-[#7b848f]">
                                                        <ImageIcon className="h-3 w-3" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-[12px] text-[#7b848f]">
                                                Sub Category
                                            </div>
                                            <Select defaultValue="Sub">
                                                <SelectTrigger className="mt-2 h-10 rounded-[10px] bg-white border border-[#e5e7eb]">
                                                    <SelectValue placeholder="Choose Sub Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Sub">
                                                        Choose Sub Category
                                                    </SelectItem>
                                                    <SelectItem value="Laptops">
                                                        Laptops
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <div className="text-[12px] text-[#7b848f]">
                                                    On Sale
                                                </div>
                                                <Select defaultValue="Yes">
                                                    <SelectTrigger className="mt-2 h-10 rounded-[10px] bg-white border border-[#e5e7eb]">
                                                        <SelectValue placeholder="Select option" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Yes">
                                                            Select option
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <div className="text-[12px] text-[#7b848f]">
                                                    Sale Type
                                                </div>
                                                <Select defaultValue="Type">
                                                    <SelectTrigger className="mt-2 h-10 rounded-[10px] bg-white border border-[#e5e7eb]">
                                                        <SelectValue placeholder="Select option" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Type">
                                                            Select option
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <div className="text-[12px] text-[#7b848f]">
                                                    Asking Price
                                                </div>
                                                <Input
                                                    placeholder="$"
                                                    className="mt-2 h-10 rounded-[10px] bg-white border border-[#e5e7eb]"
                                                />
                                            </div>
                                            <div>
                                                <div className="text-[12px] text-[#7b848f]">
                                                    Purchase Price
                                                </div>
                                                <Input
                                                    placeholder="$"
                                                    className="mt-2 h-10 rounded-[10px] bg-white border border-[#e5e7eb]"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] text-[#7b848f]">
                                                Vendor Name
                                            </div>
                                            <Input className="mt-2 h-10 rounded-[10px] bg-white border border-[#e5e7eb]" />
                                        </div>
                                        <div>
                                            <div className="text-[12px] text-[#7b848f]">
                                                Vendor Address
                                            </div>
                                            <Input className="mt-2 h-10 rounded-[10px] bg-white border border-[#e5e7eb]" />
                                        </div>
                                        <div>
                                            <div className="text-[12px] text-[#7b848f]">
                                                Sales Person Phone No.
                                            </div>
                                            <Input className="mt-2 h-10 rounded-[10px] bg-white border border-[#e5e7eb]" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-[12px] text-[#7b848f]">
                                                Details
                                            </div>
                                            <textarea
                                                placeholder="Write Something About Product"
                                                className="mt-2 h-24 w-full rounded-[10px] border border-[#e5e7eb] bg-white px-3 py-2 text-[12px] text-[#7b848f] resize-none"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-[12px] text-[#7b848f]">
                                                Date Purchased
                                            </div>
                                            <div className="relative mt-2">
                                                <Input
                                                    placeholder="DD/MM/YYYY"
                                                    className="h-10 rounded-[10px] bg-white border border-[#e5e7eb] pr-10"
                                                />
                                                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9aa3af]" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <div className="text-[12px] text-[#7b848f]">
                                                    Deal Start Date
                                                </div>
                                                <div className="relative mt-2">
                                                    <Input
                                                        placeholder="DD/MM/YYYY"
                                                        className="h-10 rounded-[10px] bg-white border border-[#e5e7eb] pr-10"
                                                    />
                                                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9aa3af]" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[12px] text-[#7b848f]">
                                                    Deal End Date
                                                </div>
                                                <div className="relative mt-2">
                                                    <Input
                                                        placeholder="DD/MM/YYYY"
                                                        className="h-10 rounded-[10px] bg-white border border-[#e5e7eb] pr-10"
                                                    />
                                                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9aa3af]" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] text-[#7b848f]">
                                                Sales Description
                                            </div>
                                            <textarea
                                                placeholder="Write Something About Product"
                                                className="mt-2 h-24 w-full rounded-[10px] border border-[#e5e7eb] bg-white px-3 py-2 text-[12px] text-[#7b848f] resize-none"
                                            />
                                        </div>
                                        <Button className="h-10 w-full rounded-[10px] bg-[#62a230] text-white">
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Card className="w-full rounded-[12px] border-0 bg-white shadow-[0px_1px_3px_#00000005,0px_6px_10px_#b1b1b114]">
                                <CardHeader className="pb-3">
                                    <CardTitle className="[font-family:'Poppins',Helvetica] font-semibold text-[#222f36] text-sm">
                                        Filters
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
                                        <div className="relative">
                                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7b848f] opacity-60" />
                                            <Input
                                                placeholder="Search posts..."
                                                className="h-10 rounded-[10px] bg-white border border-[#edf1f3] pl-9 text-sm"
                                                value={searchQuery}
                                                onChange={(e) => {
                                                    setSearchQuery(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                            />
                                        </div>

                                        <Select defaultValue="All">
                                            <SelectTrigger className="h-10 rounded-[10px] bg-white border border-[#edf1f3]">
                                                <SelectValue placeholder="All Types" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="All">
                                                    All Types
                                                </SelectItem>
                                                <SelectItem value="Regular">
                                                    Regular
                                                </SelectItem>
                                                <SelectItem value="Sponsored">
                                                    Sponsored
                                                </SelectItem>
                                                <SelectItem value="Group Buy">
                                                    Group Buy
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select defaultValue="Category">
                                            <SelectTrigger className="h-10 rounded-[10px] bg-white border border-[#edf1f3]">
                                                <SelectValue placeholder="Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Category">
                                                    Category
                                                </SelectItem>
                                                <SelectItem value="Electronics">
                                                    Electronics
                                                </SelectItem>
                                                <SelectItem value="Fashion">
                                                    Fashion
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select defaultValue="Region">
                                            <SelectTrigger className="h-10 rounded-[10px] bg-white border border-[#edf1f3]">
                                                <SelectValue placeholder="Region/City" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Region">
                                                    Region/City
                                                </SelectItem>
                                                <SelectItem value="New York">
                                                    New York
                                                </SelectItem>
                                                <SelectItem value="Bengaluru">
                                                    Bengaluru
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Button
                                            variant="outline"
                                            className="h-10 rounded-[10px] bg-white border border-[#edf1f3] justify-between text-[#7b848f] font-normal"
                                        >
                                            Date Range
                                            <CalendarIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="w-full rounded-[12px] border-0 bg-white shadow-[0px_1px_3px_#00000005,0px_6px_10px_#b1b1b114]">
                                <CardHeader className="pb-2">
                                    <CardTitle className="[font-family:'Poppins',Helvetica] font-semibold text-[#222f36] text-sm">
                                        Engagement Analytics
                                    </CardTitle>
                                    <p className="text-[#7b848f] text-xs">
                                        How your audience interacts with
                                        contents
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr] gap-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 ">
                                            {engagementStats.map((s) => (
                                                <div
                                                    key={s.title}
                                                    className="rounded-[12px] bg-[#F6F6F6] border border-[#F6F6F6] p-4"
                                                >
                                                    <div className="flex items-center justify-center">
                                                        <div className="w-10 h-10 rounded-full flex items-center justify-center">
                                                            {s.icon ===
                                                            "heart" ? (
                                                                <Heart className="h-7 w-7 text-[#62a230]" />
                                                            ) : null}
                                                            {s.icon ===
                                                            "comment" ? (
                                                                <MessageCircle className="h-7 w-7 text-[#62a230]" />
                                                            ) : null}
                                                            {s.icon ===
                                                            "share" ? (
                                                                <Share2 className="h-7 w-7 text-[#62a230]" />
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 text-center text-[#222f36] text-[18px] font-bold">
                                                        {s.value}
                                                    </div>
                                                    <div className="mt-1 text-center text-[#7b848f] text-[10px]">
                                                        {s.title}
                                                    </div>
                                                    <div className="mt-2 text-center text-[#62a230] text-[10px]">
                                                        {s.sub}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="rounded-[12px] bg-[#F6F6F6] border border-[#edf1f3] p-4">
                                            <div className="text-[#222f36] text-[12px] font-semibold">
                                                Post Type Overview
                                            </div>
                                            <div className="mt-4 space-y-3">
                                                {[
                                                    {
                                                        label: "Regular Post",
                                                        value: 88,
                                                        color: "bg-[#62a230]",
                                                    },
                                                    {
                                                        label: "Group Buy",
                                                        value: 20,
                                                        color: "bg-[#6b7280]",
                                                    },
                                                    {
                                                        label: "Sponsored Post",
                                                        value: 4,
                                                        color: "bg-[#ef4343]",
                                                    },
                                                ].map((row) => (
                                                    <div
                                                        key={row.label}
                                                        className="space-y-2"
                                                    >
                                                        <div className="flex items-center  justify-between text-[11px] text-[#7b848f]">
                                                            <span>
                                                                {row.label}
                                                            </span>
                                                            <span>
                                                                {row.value}k
                                                            </span>
                                                        </div>
                                                        <div className="h-2 rounded-full bg-[#E6E6E6] overflow-hidden">
                                                            <div
                                                                className={cn(
                                                                    "h-2 rounded-full",
                                                                    row.color,
                                                                )}
                                                                style={{
                                                                    width: `${row.value}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="rounded-[12px] bg-[#F7F7F7] border border-[#edf1f3] p-4">
                                            <div className="text-[#222f36] text-[12px] font-semibold">
                                                Likes , Dislikes overview
                                            </div>
                                            <div className="mt-4 space-y-3 ">
                                                {[
                                                    {
                                                        label: "Likes",
                                                        value: 92,
                                                        color: "bg-[#62a230]",
                                                    },
                                                    {
                                                        label: "Dislikes",
                                                        value: 8,
                                                        color: "bg-[#ef4343]",
                                                    },
                                                ].map((row) => (
                                                    <div
                                                        key={row.label}
                                                        className="space-y-2 "
                                                    >
                                                        <div className="flex items-center justify-between text-[11px] text-[#7b848f] ">
                                                            <span>
                                                                {row.label}
                                                            </span>
                                                            <span>
                                                                {row.value}%
                                                            </span>
                                                        </div>
                                                        <div className="h-2 rounded-full bg-[#E6E6E6] overflow-hidden">
                                                            <div
                                                                className={cn(
                                                                    "h-2 rounded-full",
                                                                    row.color,
                                                                )}
                                                                style={{
                                                                    width: `${row.value}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="w-full">
                                <div className="mb-2">
                                    <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-[#222f36] text-sm">
                                        Most Viewed Products
                                    </h2>
                                </div>

                                <Card className="w-full rounded-[12px] border-0 bg-white shadow-[0px_1px_3px_#00000005,0px_6px_10px_#b1b1b114]">
                                    <CardContent className="p-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_120px] gap-4">
                                            {mostViewed.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative h-[170px] rounded-[10px] overflow-hidden bg-[#f6f8fa]"
                                                >
                                                    <img
                                                        src={item.img}
                                                        alt="product"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute left-3 bottom-3 flex items-center gap-2 bg-black/60 text-white text-[11px] px-3 py-1.5 rounded-[10px]">
                                                        <Eye className="h-4 w-4" />
                                                        {item.views}
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="hidden lg:flex h-[170px] rounded-[10px] bg-[#f1f7ec] items-center justify-center">
                                                <Button
                                                    variant="ghost"
                                                    className="h-10 rounded-[10px] bg-[#e9f3e4] text-[#62a230] hover:bg-[#e9f3e4] hover:text-[#62a230]"
                                                >
                                                    See All
                                                    <ChevronRight className="h-4 w-4 ml-1" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Tabs
                                value={postType}
                                onValueChange={(v) => {
                                    setPostType(v as PostType);
                                    setCurrentPage(1);
                                }}
                                className="w-full"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <TabsList className="bg-transparent p-0 gap-2 flex flex-wrap justify-start">
                                        <TabsTrigger
                                            value="All"
                                            className="h-7 rounded-[6px] bg-[#fff] p-5 text-[10px] font-medium text-[#7b848f] data-[state=active]:bg-[#62a230] data-[state=active]:text-white"
                                        >
                                            All posts
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="Regular"
                                            className="h-7 rounded-[6px] bg-[#fff] p-5 text-[10px] font-medium text-[#7b848f] data-[state=active]:bg-[#62a230] data-[state=active]:text-white"
                                        >
                                            Regular posts
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="Sponsored"
                                            className="h-7 rounded-[6px] bg-[#fff] p-5 text-[10px] font-medium text-[#7b848f] data-[state=active]:bg-[#62a230] data-[state=active]:text-white"
                                        >
                                            Sponsored posts
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="Group Buy"
                                            className="h-7 rounded-[6px] bg-[#fff] p-5 text-[10px] font-medium text-[#7b848f] data-[state=active]:bg-[#62a230] data-[state=active]:text-white"
                                        >
                                            Group Buy Posts
                                        </TabsTrigger>
                                    </TabsList>
                                    <Button
                                        onClick={() =>
                                            setShowSponsoredForm(true)
                                        }
                                        className="h-8 rounded-[8px] bg-[#62a230] text-white text-[11px] font-semibold px-4"
                                    >
                                        Create Sponsored post
                                    </Button>
                                </div>

                                <Card className="mt-3 w-full rounded-[16px] border border-[#edf1f3] bg-white shadow-[0px_1px_3px_#00000005,0px_6px_10px_#b1b1b114] overflow-hidden">
                                    <CardContent className="p-0">
                                        <TabsContent
                                            value={postType}
                                            className="m-0"
                                        >
                                            <div className="w-full overflow-x-auto">
                                                <div className="min-w-[1040px]">
                                                    <Table className="w-full">
                                                        <TableHeader className="bg-[#f3f3f3]">
                                                            <TableRow className="bg-[#f3f3f3] hover:bg-[#f3f3f3]">
                                                                <TableHead className="pl-6 w-[160px] bg-[#f3f3f3] text-xs text-[#666666] font-normal">
                                                                    User Created
                                                                </TableHead>
                                                                <TableHead className="w-[260px] bg-[#f3f3f3] text-xs text-[#666666] font-normal">
                                                                    Post Title
                                                                </TableHead>
                                                                <TableHead className="w-[120px] bg-[#f3f3f3] text-xs text-[#666666] font-normal">
                                                                    Type
                                                                </TableHead>
                                                                <TableHead className="w-[140px] bg-[#f3f3f3] text-xs text-[#666666] font-normal">
                                                                    Category
                                                                </TableHead>
                                                                <TableHead className="w-[140px] bg-[#f3f3f3] text-xs text-[#666666] font-normal">
                                                                    Subcategory
                                                                </TableHead>
                                                                <TableHead className="w-[150px] bg-[#f3f3f3] text-xs text-[#666666] font-normal">
                                                                    Deal Start
                                                                    Date
                                                                </TableHead>
                                                                <TableHead className="w-[190px] bg-[#f3f3f3] text-xs text-[#666666] font-normal">
                                                                    Engagement
                                                                </TableHead>
                                                                <TableHead className="w-[120px] bg-[#f3f3f3] text-xs text-[#666666] font-normal text-center">
                                                                    Status
                                                                </TableHead>
                                                                <TableHead className="w-[80px] bg-[#f3f3f3] text-xs text-[#666666] font-normal text-center">
                                                                    More
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                    </Table>
                                                </div>
                                                <div className="min-w-[1040px] h-[520px] overflow-y-auto relative">
                                                    {isLoading ? (
                                                        <div className="flex items-center justify-center h-full">
                                                            <Loader2 className="h-8 w-8 animate-spin text-[#62a230]" />
                                                        </div>
                                                    ) : filteredPosts.length === 0 ? (
                                                        <div className="flex items-center justify-center h-full text-[#7b848f] text-sm">
                                                            No posts found
                                                        </div>
                                                    ) : (
                                                    <Table className="w-full">
                                                        <TableBody>
                                                            {filteredPosts.map(
                                                                (p, idx) => {
                                                                    const detailData = toPostDetailData(p, idx);
                                                                    const displayDate = p.dealStartDate
                                                                        ? format(new Date(p.dealStartDate), "dd-MM-yyyy")
                                                                        : "—";
                                                                    const statusLabel = p.status === "ACTIVE" ? "Active" : p.status;
                                                                    return (
                                                                    <TableRow
                                                                        key={
                                                                            p._id
                                                                        }
                                                                        role="button"
                                                                        tabIndex={
                                                                            0
                                                                        }
                                                                        onClick={() =>
                                                                            setSelectedPost(
                                                                                detailData,
                                                                            )
                                                                        }
                                                                        onKeyDown={(
                                                                            e,
                                                                        ) => {
                                                                            if (
                                                                                e.key ===
                                                                                "Enter"
                                                                            ) {
                                                                                setSelectedPost(
                                                                                    detailData,
                                                                                );
                                                                            }
                                                                        }}
                                                                        className="border-b border-[#f1f3f5] h-[48px] cursor-pointer hover:bg-[#fafafa]"
                                                                    >
                                                                        <TableCell className="pl-6 w-[160px]">
                                                                            <div className="flex items-center gap-2">
                                                                                <img
                                                                                    src={
                                                                                        p.authorDetails?.avatar || "/figmaAssets/ellipse-11.svg"
                                                                                    }
                                                                                    alt={
                                                                                        p.authorDetails?.name || "User"
                                                                                    }
                                                                                    className="w-7 h-7 rounded-full object-cover bg-[#f0f0f0]"
                                                                                    onError={(e) => {
                                                                                        (e.target as HTMLImageElement).src = "/figmaAssets/ellipse-11.svg";
                                                                                    }}
                                                                                />
                                                                                <div className="text-xs text-[#222f36] truncate max-w-[100px]">
                                                                                    {
                                                                                        p.authorDetails?.name || "Unknown"
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="w-[260px]">
                                                                            <div className="flex items-center gap-3">
                                                                                <img
                                                                                    src={
                                                                                        p.thumbnail || "/figmaAssets/group-1.png"
                                                                                    }
                                                                                    alt={
                                                                                        p.title
                                                                                    }
                                                                                    className="w-9 h-9 rounded-[8px] object-cover bg-[#f0f0f0]"
                                                                                    onError={(e) => {
                                                                                        (e.target as HTMLImageElement).src = "/figmaAssets/group-1.png";
                                                                                    }}
                                                                                />
                                                                                <div>
                                                                                    <div className="text-xs font-medium text-[#222f36] truncate max-w-[180px]">
                                                                                        {
                                                                                            p.title
                                                                                        }
                                                                                    </div>
                                                                                    <div className="text-[10px] text-[#7b848f]">
                                                                                        {p.createdAt
                                                                                            ? format(new Date(p.createdAt), "dd MMM yyyy")
                                                                                            : "—"}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="w-[120px]">
                                                                            <span
                                                                                className={cn(
                                                                                    "px-2 py-1 rounded-full text-[10px]",
                                                                                    p.type ===
                                                                                        "Sponsored"
                                                                                        ? "bg-[#e6f3ff] text-[#2f80ed]"
                                                                                        : p.type ===
                                                                                            "Group Buy"
                                                                                          ? "bg-[#e9f3e4] text-[#62a230]"
                                                                                          : "bg-[#f1f1f1] text-[#7b848f]",
                                                                                )}
                                                                            >
                                                                                {
                                                                                    p.type
                                                                                }
                                                                            </span>
                                                                        </TableCell>
                                                                        <TableCell className="w-[140px] text-xs text-[#7b848f]">
                                                                            {
                                                                                p.category
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell className="w-[140px] text-xs text-[#7b848f]">
                                                                            {
                                                                                p.subCategory || "—"
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell className="w-[150px] text-xs text-[#7b848f]">
                                                                            {
                                                                                displayDate
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell className="w-[190px]">
                                                                            <div className="flex items-center gap-5 text-[11px]">
                                                                                <div className="flex items-center gap-1.5 text-[#222f36]">
                                                                                    <ThumbsUp className="h-4 w-4 text-[#62a230]" />
                                                                                    <span>
                                                                                        {
                                                                                            p.engagement?.likes ?? 0
                                                                                        }{" "}
                                                                                        likes
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex items-center gap-1.5 text-[#222f36]">
                                                                                    <MessageCircle className="h-4 w-4 text-[#2f80ed]" />
                                                                                    <span>
                                                                                        {
                                                                                            p.engagement?.comments ?? 0
                                                                                        }{" "}
                                                                                        comments
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="w-[120px] text-center">
                                                                            <div className="flex items-center justify-center gap-2">
                                                                                <span
                                                                                    className={cn(
                                                                                        "relative inline-flex h-[12px] w-[22px] flex-shrink-0 rounded-full",
                                                                                        statusLabel ===
                                                                                            "Active"
                                                                                            ? "bg-[#62a230]"
                                                                                            : "bg-[#cfd6dd]",
                                                                                    )}
                                                                                >
                                                                                    <span
                                                                                        className={cn(
                                                                                            "absolute top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform",
                                                                                            statusLabel ===
                                                                                                "Active"
                                                                                                ? "translate-x-[11px] left-[1px]"
                                                                                                : "translate-x-0 left-[1px]",
                                                                                        )}
                                                                                    />
                                                                                </span>
                                                                                <span
                                                                                    className={cn(
                                                                                        "text-[11px] font-medium",
                                                                                        statusLabel ===
                                                                                            "Active"
                                                                                            ? "text-[#62a230]"
                                                                                            : "text-[#9aa3ad]",
                                                                                    )}
                                                                                >
                                                                                    {
                                                                                        statusLabel
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="w-[80px] text-center">
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger
                                                                                    asChild
                                                                                >
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        className="h-8 w-8 rounded-full hover:bg-[#f4f5f7]"
                                                                                        onClick={(
                                                                                            e,
                                                                                        ) =>
                                                                                            e.stopPropagation()
                                                                                        }
                                                                                    >
                                                                                        <MoreHorizontal className="h-4 w-4 text-[#9aa3ad]" />
                                                                                    </Button>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent
                                                                                    align="end"
                                                                                    className="w-40"
                                                                                >
                                                                                    <DropdownMenuItem
                                                                                        className="cursor-pointer"
                                                                                        onSelect={(e) => {
                                                                                            e.stopPropagation();
                                                                                            setSelectedPost(detailData);
                                                                                        }}
                                                                                    >
                                                                                        View
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem
                                                                                        className="cursor-pointer"
                                                                                        onSelect={(e) => {
                                                                                            e.stopPropagation();
                                                                                            setLocationPath(`/posts/edit?id=${p._id}`);
                                                                                        }}
                                                                                    >
                                                                                        Edit
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem
                                                                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                                                                        onSelect={(e) => {
                                                                                            e.stopPropagation();
                                                                                            setDeletePostId(p._id);
                                                                                            setDeletePostTitle(p.title);
                                                                                            setShowDeleteConfirm(true);
                                                                                        }}
                                                                                    >
                                                                                        Delete
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );},
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 border-t border-[#edf1f3]">
                                                <div className="text-xs text-[#7b848f]">
                                                    {pagination
                                                        ? `Showing page ${pagination.page} of ${pagination.pages} (${Math.max(0, (pagination.total ?? 0) - deletedPostIds.size)} total posts)`
                                                        : "Loading..."}
                                                </div>
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 rounded-full bg-[#e9f3e4] hover:bg-[#e9f3e4]"
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                (p) =>
                                                                    Math.max(
                                                                        1,
                                                                        p - 1,
                                                                    ),
                                                            )
                                                        }
                                                        disabled={
                                                            currentPage === 1
                                                        }
                                                    >
                                                        <ChevronLeft className="h-4 w-4 text-[#62a230]" />
                                                    </Button>

                                                    {Array.from({
                                                        length: totalPages,
                                                    }).map((_, idx) => {
                                                        const page = idx + 1;
                                                        const label = String(
                                                            page,
                                                        ).padStart(2, "0");
                                                        const active =
                                                            page ===
                                                            currentPage;
                                                        return (
                                                            <Button
                                                                key={label}
                                                                variant="ghost"
                                                                className={cn(
                                                                    "h-9 w-9 rounded-full text-xs",
                                                                    active
                                                                        ? "bg-[#62a230] text-white hover:bg-[#62a230] hover:text-white"
                                                                        : "text-[#7b848f] hover:bg-transparent",
                                                                )}
                                                                onClick={() =>
                                                                    setCurrentPage(
                                                                        page,
                                                                    )
                                                                }
                                                            >
                                                                {label}
                                                            </Button>
                                                        );
                                                    })}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 rounded-full bg-[#e9f3e4] hover:bg-[#e9f3e4]"
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                (p) =>
                                                                    Math.min(
                                                                        totalPages,
                                                                        p + 1,
                                                                    ),
                                                            )
                                                        }
                                                        disabled={
                                                            currentPage ===
                                                            totalPages
                                                        }
                                                    >
                                                        <ChevronRight className="h-4 w-4 text-[#62a230]" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </CardContent>
                                </Card>
                            </Tabs>
                        </>
                    )}
                </div>
            </main>

            <PostDetailPopup
                open={Boolean(selectedPost)}
                post={selectedPost}
                onClose={() => setSelectedPost(null)}
                onViewInsights={(post) => {
                    setSelectedPost(null);
                    setInsightsPost(post);
                }}
            />

            <PostInsightsPopup
                open={Boolean(insightsPost)}
                post={insightsPost}
                onClose={() => setInsightsPost(null)}
            />

            {/* ── Delete Confirm Dialog ─────────────────────────── */}
            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center"
                    onClick={() => setShowDeleteConfirm(false)}
                >
                    <div className="absolute inset-0 bg-black/30" />
                    <div
                        className="relative w-[620px] max-w-[calc(100vw-40px)] rounded-[16px] bg-white px-10 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            aria-label="Close"
                            className="absolute right-4 top-4 h-9 w-9 rounded-full hover:bg-[#f6f8fa] flex items-center justify-center"
                            onClick={() => setShowDeleteConfirm(false)}
                        >
                            <X className="h-4 w-4 text-[#7b848f]" />
                        </button>

                        <div className="text-center">
                            <div className="text-[18px] font-semibold text-[#222f36]">
                                Are you sure you want to delete this post?
                            </div>
                            <div className="mt-2 text-[13px] text-[#7b848f]">
                                &ldquo;{deletePostTitle}&rdquo;
                            </div>
                            <div className="mt-3 text-[12px] text-[#7b848f] leading-5">
                                This action cannot be undone. The post will be permanently removed.
                            </div>

                            <div className="mt-8 flex items-center justify-center gap-6">
                                <Button
                                    type="button"
                                    className="h-10 w-[110px] rounded-[10px] bg-[#62a230] text-white hover:bg-[#62a230] hover:text-white"
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setShowDeleteReason(true);
                                    }}
                                >
                                    Yes
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-10 w-[110px] rounded-[10px] border-[#e5e7eb] bg-[#f4f5f7] text-[#222f36] hover:bg-[#f4f5f7] hover:text-[#222f36]"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    No
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Reason Dialog ──────────────────────────── */}
            {showDeleteReason && (
                <div
                    className="fixed inset-0 z-[210] flex items-center justify-center"
                    onClick={() => setShowDeleteReason(false)}
                >
                    <div className="absolute inset-0 bg-black/30" />
                    <div
                        className="relative w-[520px] max-w-[calc(100vw-40px)] rounded-[22px] bg-white px-8 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            aria-label="Close"
                            className="absolute right-5 top-5 h-9 w-9 rounded-full hover:bg-[#f6f8fa] flex items-center justify-center"
                            onClick={() => setShowDeleteReason(false)}
                        >
                            <X className="h-4 w-4 text-[#7b848f]" />
                        </button>

                        <div className="text-[22px] font-semibold text-[#222f36]">
                            Why Are You Deleting This Post?
                        </div>

                        <div className="mt-7 space-y-4">
                            {[
                                { key: "reason1" as const, label: "Inappropriate Content" },
                                { key: "reason2" as const, label: "Spam Content" },
                                { key: "reason3" as const, label: "Violates Community Guidelines" },
                                { key: "reason4" as const, label: "Reported by Users" },
                            ].map((r) => {
                                const selected = deleteReason === r.key;
                                return (
                                    <button
                                        key={r.key}
                                        type="button"
                                        onClick={() => setDeleteReason(r.key)}
                                        className="w-full rounded-[14px] bg-[#f6f7f9] px-6 py-5 flex items-center justify-between text-left"
                                    >
                                        <div className="text-[15px] text-[#222f36]">
                                            {r.label}
                                        </div>
                                        <div
                                            className={
                                                selected
                                                    ? "h-5 w-5 rounded-full border-2 border-[#62a230] flex items-center justify-center"
                                                    : "h-5 w-5 rounded-full border-2 border-[#d0d5dd]"
                                            }
                                        >
                                            {selected && (
                                                <div className="h-[10px] w-[10px] rounded-full bg-[#62a230]" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}

                            <div className="w-full rounded-[14px] bg-[#f6f7f9] px-6 py-5">
                                <button
                                    type="button"
                                    onClick={() => setDeleteReason("custom")}
                                    className="w-full flex items-center justify-between text-left"
                                >
                                    <div className="text-[15px] text-[#222f36]">
                                        Custom Reason
                                    </div>
                                    <div
                                        className={
                                            deleteReason === "custom"
                                                ? "h-5 w-5 rounded-full border-2 border-[#62a230] flex items-center justify-center"
                                                : "h-5 w-5 rounded-full border-2 border-[#d0d5dd]"
                                        }
                                    >
                                        {deleteReason === "custom" && (
                                            <div className="h-[10px] w-[10px] rounded-full bg-[#62a230]" />
                                        )}
                                    </div>
                                </button>

                                <textarea
                                    className="mt-4 w-full min-h-[120px] rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 text-[13px] text-[#222f36] outline-none resize-none"
                                    placeholder="Write Something"
                                    value={deleteCustomReason}
                                    onChange={(e) => setDeleteCustomReason(e.target.value)}
                                    onFocus={() => setDeleteReason("custom")}
                                />
                            </div>
                        </div>

                        <Button
                            type="button"
                            className="mt-7 h-12 w-full rounded-[12px] bg-[#62a230] text-white hover:bg-[#62a230] hover:text-white"
                            disabled={deletePostMutation.isPending}
                            onClick={() => {
                                if (!deletePostId) return;
                                const reasonLabels: Record<string, string> = {
                                    reason1: "Inappropriate Content",
                                    reason2: "Spam Content",
                                    reason3: "Violates Community Guidelines",
                                    reason4: "Reported by Users",
                                };
                                const finalReason =
                                    deleteReason === "custom"
                                        ? deleteCustomReason || "Custom reason"
                                        : reasonLabels[deleteReason];
                                deletePostMutation.mutate(
                                    { postId: deletePostId, reason: finalReason },
                                    {
                                        onSuccess: () => {
                                            // Track this post as deleted locally
                                            if (deletePostId) {
                                                setDeletedPostIds((prev) => {
                                                    const next = new Set(prev);
                                                    next.add(deletePostId);
                                                    return next;
                                                });
                                            }
                                            setShowDeleteReason(false);
                                            setDeletePostId(null);
                                            setDeletePostTitle("");
                                            setDeleteReason("reason1");
                                            setDeleteCustomReason("");
                                            // Close any open detail/insight popups
                                            setSelectedPost(null);
                                            setInsightsPost(null);
                                        },
                                    },
                                );
                            }}
                        >
                            {deletePostMutation.isPending ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
