import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { usePostDetail, useUpdatePost } from "@/hooks/usePosts";

export const EditPostScreen = (): JSX.Element => {
    const [, setLocation] = useLocation();

    // Read post _id from query string
    const postId = useMemo(() => {
        return new URLSearchParams(window.location.search).get("id") || "";
    }, []);

    // Fetch real post data
    const { data: postResponse, isLoading, isError } = usePostDetail(postId);
    const post = postResponse?.data;

    const updateMutation = useUpdatePost();

    // ── Form state ──────────────────────────────────────────────────
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [onSale, setOnSale] = useState("no");
    const [saleType, setSaleType] = useState("regular");
    const [originalPrice, setOriginalPrice] = useState("");
    const [purchasePrice, setPurchasePrice] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [datePurchased, setDatePurchased] = useState("");
    const [saleStartDate, setSaleStartDate] = useState("");
    const [saleEndDate, setSaleEndDate] = useState("");

    // Pre-fill form when post loads
    useEffect(() => {
        if (!post) return;
        setTitle(post.title || "");
        setDescription(post.description || "");
        setCategory(post.category || "");
        setSubCategory(post.subCategory || "");
        setOnSale(post.onSale ? "yes" : "no");
        setSaleType(post.saleType || "regular");
        setOriginalPrice(post.originalPrice?.toString() || "");
        setPurchasePrice(post.purchasePrice?.toString() || "");
        setWebsiteUrl(post.websiteUrl || "");
        setDatePurchased(post.datePurchased || "");
        setSaleStartDate(post.dealStartDate || "");
        setSaleEndDate(post.dealEndDate || "");
    }, [post]);

    // ── Image carousel ─────────────────────────────────────────────
    const images = useMemo(() => {
        if (post?.images && post.images.length > 0) return post.images;
        if (post?.thumbnail) return [post.thumbnail];
        return ["/figmaAssets/group-1.png"];
    }, [post]);

    const [imgIndex, setImgIndex] = useState(0);

    // ── Update handler ──────────────────────────────────────────────
    const handleUpdate = () => {
        if (!postId) return;
        updateMutation.mutate(
            {
                postId,
                payload: {
                    title,
                    description,
                    category,
                    subCategory,
                    onSale: onSale === "yes",
                    saleType,
                    originalPrice: originalPrice ? Number(originalPrice) : undefined,
                    purchasePrice: purchasePrice ? Number(purchasePrice) : undefined,
                    websiteUrl: websiteUrl || undefined,
                    datePurchased: datePurchased || undefined,
                    dealStartDate: saleStartDate || undefined,
                    dealEndDate: saleEndDate || undefined,
                },
            },
            {
                onSuccess: () => {
                    setLocation("/posts");
                },
            },
        );
    };

    // ── Loading / Error ─────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="bg-[#F5F6FA] w-full h-screen overflow-hidden">
                <div className="hidden lg:block fixed inset-y-0 left-0 w-[312px] z-40">
                    <Sidebar className="w-[280px]" variant="desktop" />
                </div>
                <main className="h-screen overflow-y-auto no-scrollbar lg:pl-[292px] flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-[#62a230]" />
                </main>
            </div>
        );
    }

    if (isError || !post) {
        return (
            <div className="bg-[#F5F6FA] w-full h-screen overflow-hidden">
                <div className="hidden lg:block fixed inset-y-0 left-0 w-[312px] z-40">
                    <Sidebar className="w-[280px]" variant="desktop" />
                </div>
                <main className="h-screen overflow-y-auto no-scrollbar lg:pl-[292px] flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-lg font-semibold text-[#222f36]">
                            Post not found
                        </div>
                        <Button
                            className="mt-4 bg-[#62a230] text-white hover:bg-[#62a230]"
                            onClick={() => setLocation("/posts")}
                        >
                            Back to Posts
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-[#F5F6FA] w-full h-screen overflow-hidden">
            <div className="hidden lg:block fixed inset-y-0 left-0 w-[312px] z-40">
                <Sidebar className="w-[280px]" variant="desktop" />
            </div>

            <main className="h-screen overflow-y-auto no-scrollbar lg:pl-[292px] mt-36">
                <div className="p-[16px] sm:p-[24px] overflow-x-hidden">
                    <div className="flex items-center gap-2 text-[#222f36]">
                        <button
                            type="button"
                            className="h-8 w-8 flex items-center justify-center text-[#222f36]"
                            onClick={() => setLocation("/posts")}
                            aria-label="Back"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div className="text-[18px] font-semibold">
                            Edit Post
                        </div>
                    </div>

                    <div className="mt-6 w-full bg-[#eef1f5] rounded-[16px] p-6 sm:p-7">
                        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr_300px] gap-6">
                            {/* ── Left column: Images ──────────────── */}
                            <div className="space-y-5">
                                <div>
                                    <div className="text-[12px] font-medium text-[#7b848f]">
                                        Upload Product images
                                    </div>
                                    <div className="mt-2 bg-white border border-[#e7eaee] rounded-[10px] h-[132px] flex items-center justify-center relative overflow-hidden">
                                        <img
                                            src={images[imgIndex]}
                                            alt="Product"
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src =
                                                    "/figmaAssets/group-1.png";
                                            }}
                                        />
                                        <div className="absolute right-3 top-2 text-[11px] text-[#7b848f]">
                                            {imgIndex + 1}/{images.length}
                                        </div>

                                        {images.length > 1 && (
                                            <>
                                                <button
                                                    type="button"
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white/90 border border-[#e7eaee] flex items-center justify-center"
                                                    onClick={() =>
                                                        setImgIndex((i) =>
                                                            (i - 1 + images.length) %
                                                            images.length,
                                                        )
                                                    }
                                                    aria-label="Previous"
                                                >
                                                    <ChevronLeft className="h-4 w-4 text-[#7b848f]" />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white/90 border border-[#e7eaee] flex items-center justify-center"
                                                    onClick={() =>
                                                        setImgIndex((i) =>
                                                            (i + 1) % images.length,
                                                        )
                                                    }
                                                    aria-label="Next"
                                                >
                                                    <ChevronRight className="h-4 w-4 text-[#7b848f]" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[12px] font-medium text-[#7b848f]">
                                        Upload Receipt
                                    </div>
                                    <div className="mt-2 bg-white border border-[#e7eaee] rounded-[10px] h-[132px] flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/figmaAssets/receipt.png"
                                            alt="Receipt"
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src =
                                                    "/figmaAssets/group-1.png";
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[12px] font-medium text-[#7b848f]">
                                        Product Name
                                    </div>
                                    <Input
                                        className="mt-2 h-10 rounded-[8px] border-[#e7eaee] bg-white text-[12px]"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* ── Middle column: Details ────────────── */}
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[12px] font-medium text-[#7b848f]">
                                        Details
                                    </div>
                                    <Textarea
                                        className="mt-2 min-h-[118px] rounded-[8px] border-[#e7eaee] bg-white text-[12px] leading-5"
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <div className="text-[12px] font-medium text-[#7b848f]">
                                        Category
                                    </div>
                                    <Select
                                        value={category}
                                        onValueChange={setCategory}
                                    >
                                        <SelectTrigger className="mt-2 h-10 rounded-[8px] border-[#e7eaee] bg-white text-[12px]">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Automotive">
                                                Automotive - Parts
                                            </SelectItem>
                                            <SelectItem value="Electronics">
                                                Electronics
                                            </SelectItem>
                                            <SelectItem value="Fashion">
                                                Fashion
                                            </SelectItem>
                                            <SelectItem value="Home">
                                                Home & Garden
                                            </SelectItem>
                                            <SelectItem value="other">
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[12px] font-medium text-[#7b848f]">
                                            On Sale
                                        </div>
                                        <Select
                                            value={onSale}
                                            onValueChange={setOnSale}
                                        >
                                            <SelectTrigger className="mt-2 h-10 rounded-[8px] border-[#e7eaee] bg-white text-[12px]">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="no">
                                                    No
                                                </SelectItem>
                                                <SelectItem value="yes">
                                                    Yes
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <div className="text-[12px] font-medium text-[#7b848f]">
                                            Sale Type
                                        </div>
                                        <Select
                                            value={saleType}
                                            onValueChange={setSaleType}
                                        >
                                            <SelectTrigger className="mt-2 h-10 rounded-[8px] border-[#e7eaee] bg-white text-[12px]">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="regular">
                                                    Regular Price
                                                </SelectItem>
                                                <SelectItem value="discount">
                                                    Discount
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[12px] font-medium text-[#7b848f]">
                                            Original Price
                                        </div>
                                        <div className="relative mt-2">
                                            <Input
                                                className="h-10 rounded-[8px] border-[#e7eaee] bg-white pl-7 text-[12px]"
                                                value={originalPrice}
                                                onChange={(e) =>
                                                    setOriginalPrice(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7b848f] text-[12px]">
                                                $
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[12px] font-medium text-[#7b848f]">
                                            Purchase Price
                                        </div>
                                        <div className="relative mt-2">
                                            <Input
                                                className="h-10 rounded-[8px] border-[#e7eaee] bg-white pl-7 text-[12px]"
                                                value={purchasePrice}
                                                onChange={(e) =>
                                                    setPurchasePrice(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7b848f] text-[12px]">
                                                $
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Right column: URLs & Dates ─────────── */}
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[12px] font-medium text-[#7b848f]">
                                        Website Addresses
                                    </div>
                                    <Input
                                        className="mt-2 h-10 rounded-[8px] border-[#e7eaee] bg-white text-[12px]"
                                        value={websiteUrl}
                                        onChange={(e) =>
                                            setWebsiteUrl(e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <div className="text-[12px] font-medium text-[#7b848f]">
                                        Date Purchased
                                    </div>
                                    <div className="relative mt-2">
                                        <Input
                                            className="h-10 rounded-[8px] border-[#e7eaee] bg-white pr-10 text-[12px]"
                                            value={datePurchased}
                                            onChange={(e) =>
                                                setDatePurchased(e.target.value)
                                            }
                                        />
                                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7b848f]" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[12px] font-medium text-[#7b848f]">
                                            Sale Start Date
                                        </div>
                                        <div className="relative mt-2">
                                            <Input
                                                className="h-10 rounded-[8px] border-[#e7eaee] bg-white pr-10 text-[12px]"
                                                value={saleStartDate}
                                                onChange={(e) =>
                                                    setSaleStartDate(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7b848f]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[12px] font-medium text-[#7b848f]">
                                            Sale End Date
                                        </div>
                                        <div className="relative mt-2">
                                            <Input
                                                className="h-10 rounded-[8px] border-[#e7eaee] bg-white pr-10 text-[12px]"
                                                value={saleEndDate}
                                                onChange={(e) =>
                                                    setSaleEndDate(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7b848f]" />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    className="mt-2 h-10 w-full rounded-[8px] bg-[#62a230] text-white hover:bg-[#62a230] hover:text-white text-[13px] font-semibold"
                                    disabled={updateMutation.isPending}
                                    onClick={handleUpdate}
                                >
                                    {updateMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : null}
                                    Update
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
