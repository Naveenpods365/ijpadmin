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
                        <div className="text-[18px] font-semibold">Edit Post</div>
                    </div>

                    <div className="mt-6 w-full  bg-[#eef1f5] rounded-[16px] p-6 sm:p-7 ">
                        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr_300px] gap-6">
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
                                        />
                                        <div className="absolute right-3 top-2 text-[11px] text-[#7b848f]">
                                            1/12
                                        </div>

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
                                        className="mt-2 min-h-[118px] rounded-[8px] border-[#e7eaee] bg-white text-[12px] leading-5"
                                        defaultValue="Lorem ipsum dolor sit amet consectetur. Feugiat quis in tellus rhoncus. Sed dui purus. Aplipcsiing nullam felis sed est consectetur risus. Morbi hac massa mattis convallis tincidunt at. Etiam hac cras sed ac elementum amet. Aliquam id et tincidunt."
                                    />
                                </div>

                                <div>
                                    <div className="text-[12px] font-medium text-[#7b848f]">
                                        Category
                                    </div>
                                    <Select defaultValue="automotive">
                                        <SelectTrigger className="mt-2 h-10 rounded-[8px] border-[#e7eaee] bg-white text-[12px]">
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
                                            <SelectTrigger className="mt-2 h-10 rounded-[8px] border-[#e7eaee] bg-white text-[12px]">
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
                                                className="h-10 rounded-[8px] border-[#e7eaee] bg-white pl-7 text-[12px]"
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
                                    <Input className="mt-2 h-10 rounded-[8px] border-[#e7eaee] bg-white text-[12px]" />
                                </div>

                                <div>
                                    <div className="text-[12px] font-medium text-[#7b848f]">
                                        Date Purchased
                                    </div>
                                    <div className="relative mt-2">
                                        <Input
                                            className="h-10 rounded-[8px] border-[#e7eaee] bg-white pr-10 text-[12px]"
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
                                                className="h-10 rounded-[8px] border-[#e7eaee] bg-white pr-10 text-[12px]"
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
                                                className="h-10 rounded-[8px] border-[#e7eaee] bg-white pr-10 text-[12px]"
                                                defaultValue="31 Dec 2024"
                                            />
                                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7b848f]" />
                                        </div>
                                    </div>
                                </div>

                                <Button className="mt-2 h-10 w-full rounded-[8px] bg-[#62a230] text-white hover:bg-[#62a230] hover:text-white text-[13px] font-semibold">
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
