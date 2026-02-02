import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
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

export const EditPostScreen = (): JSX.Element => {
    const [, setLocation] = useLocation();
    const postId = useMemo(() => {
        const id = new URLSearchParams(window.location.search).get("id");
        return id ? Number(id) : null;
    }, []);

    const images = useMemo(() => {
        const base = [
            "/figmaAssets/component-6.png",
            "/figmaAssets/group.png",
            "/figmaAssets/group-2.png",
            "/figmaAssets/group-3.png",
        ];
        if (!postId) return base;
        const offset = postId % base.length;
        return base.slice(offset).concat(base.slice(0, offset));
    }, [postId]);

    const [imgIndex, setImgIndex] = useState(0);

    return (
        <div className="bg-[#F5F6FA] w-full h-screen overflow-hidden">
            <div className="hidden lg:block fixed inset-y-0 left-0 w-[312px] z-40">
                <Sidebar className="w-[280px]" variant="desktop" />
            </div>

            <main className="h-screen overflow-y-auto no-scrollbar lg:pl-[312px]">
                <div className="p-[16px] sm:p-[24px] pl-0 sm:pl-[5px] overflow-x-hidden">
                    <div className="flex items-center gap-2 text-[#222f36] font-medium">
                        <button
                            type="button"
                            className="h-9 w-9 rounded-full hover:bg-white flex items-center justify-center"
                            onClick={() => setLocation("/posts")}
                            aria-label="Back"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div className="text-[16px]">Edit Post</div>
                    </div>

                    <div className="mt-6 w-full max-w-[980px] bg-[#eef0f4] rounded-[14px] p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr_300px] gap-6">
                            <div className="space-y-5">
                                <div>
                                    <div className="text-[12px] font-medium text-[#7b848f]">
                                        Upload Product images
                                    </div>
                                    <div className="mt-2 bg-white border border-[#e7eaee] rounded-[10px] h-[140px] flex items-center justify-center relative overflow-hidden">
                                        <img
                                            src={images[imgIndex]}
                                            alt="Product"
                                            className="h-full w-full object-cover"
                                        />

                                        <button
                                            type="button"
                                            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 border border-[#e7eaee] flex items-center justify-center"
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
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 border border-[#e7eaee] flex items-center justify-center"
                                            onClick={() =>
                                                setImgIndex((i) =>
                                                    (i + 1) % images.length,
                                                )
                                            }
                                            aria-label="Next"
                                        >
                                            <ChevronRight className="h-4 w-4 text-[#7b848f]" />
                                        </button>

                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
                                            {images.map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={
                                                        i === imgIndex
                                                            ? "h-[6px] w-[6px] rounded-full bg-[#62a230]"
                                                            : "h-[6px] w-[6px] rounded-full bg-[#d9dde3]"
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[12px] font-medium text-[#7b848f]">
                                        Upload Receipt
                                    </div>
                                    <div className="mt-2 bg-white border border-[#e7eaee] rounded-[10px] h-[140px] flex items-center justify-center overflow-hidden">
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
                                        className="mt-2 h-11 rounded-[10px] border-[#e7eaee] bg-white"
                                        defaultValue="Lexus RX350 F-Sport Windshield w/ HUD"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-[12px] font-medium text-[#7b848f]">
                                        Details
                                    </div>
                                    <Textarea
                                        className="mt-2 min-h-[108px] rounded-[10px] border-[#e7eaee] bg-white"
                                        defaultValue="Lorem ipsum dolor sit amet consectetur. Feugiat quis in tellus rhoncus. Sed dui purus. Aplipcsiing nullam felis sed est consectetur risus. Morbi hac massa mattis convallis tincidunt at. Etiam hac cras sed ac elementum amet. Aliquam id et tincidunt."
                                    />
                                </div>

                                <div>
                                    <div className="text-[12px] font-medium text-[#7b848f]">
                                        Category
                                    </div>
                                    <Select defaultValue="automotive">
                                        <SelectTrigger className="mt-2 h-11 rounded-[10px] border-[#e7eaee] bg-white">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="automotive">
                                                Automotive - Parts
                                            </SelectItem>
                                            <SelectItem value="electronics">
                                                Electronics
                                            </SelectItem>
                                            <SelectItem value="fashion">
                                                Fashion
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[12px] font-medium text-[#7b848f]">
                                            On Sale
                                        </div>
                                        <Select defaultValue="no">
                                            <SelectTrigger className="mt-2 h-11 rounded-[10px] border-[#e7eaee] bg-white">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="no">No</SelectItem>
                                                <SelectItem value="yes">Yes</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <div className="text-[12px] font-medium text-[#7b848f]">
                                            Sale Type
                                        </div>
                                        <Select defaultValue="regular">
                                            <SelectTrigger className="mt-2 h-11 rounded-[10px] border-[#e7eaee] bg-white">
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
                                                className="h-11 rounded-[10px] border-[#e7eaee] bg-white pl-7"
                                                defaultValue="2000"
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
                                                className="h-11 rounded-[10px] border-[#e7eaee] bg-white pl-7"
                                                defaultValue="340"
                                            />
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7b848f] text-[12px]">
                                                $
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-[12px] font-medium text-[#7b848f]">
                                        Website Addresses
                                    </div>
                                    <Input className="mt-2 h-11 rounded-[10px] border-[#e7eaee] bg-white" />
                                </div>

                                <div>
                                    <div className="text-[12px] font-medium text-[#7b848f]">
                                        Date Purchased
                                    </div>
                                    <div className="relative mt-2">
                                        <Input
                                            className="h-11 rounded-[10px] border-[#e7eaee] bg-white pr-10"
                                            defaultValue="20 April 2024"
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
                                                className="h-11 rounded-[10px] border-[#e7eaee] bg-white pr-10"
                                                defaultValue="20 Dec 2024"
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
                                                className="h-11 rounded-[10px] border-[#e7eaee] bg-white pr-10"
                                                defaultValue="31 Dec 2024"
                                            />
                                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7b848f]" />
                                        </div>
                                    </div>
                                </div>

                                <Button className="mt-2 h-11 w-full rounded-[10px] bg-[#62a230] text-white hover:bg-[#62a230] hover:text-white">
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
