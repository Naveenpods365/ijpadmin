import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
    ArrowLeft,
    BarChart3,
    Ban,
    ChevronLeft,
    ChevronRight,
    Eye,
    Heart,
    MessageCircle,
    MoreHorizontal,
    Pencil,
    Play,
    Share2,
    Star,
    Sparkles,
    ThumbsUp,
    Trash2,
    X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type PostDetailData = {
    id: number;
    user: string;
    userAvatar: string;
    post: string;
    postImg: string;
    type: string;
    category: string;
    subCategory: string;
    startDate: string;
    likes: number;
    comments: number;
    status: string;
};

type PostDetailPopupProps = {
    open: boolean;
    post: PostDetailData | null;
    onClose: () => void;
    onViewInsights?: (post: PostDetailData) => void;
};

export function PostDetailPopup({
    open,
    post,
    onClose,
    onViewInsights,
}: PostDetailPopupProps) {
    const [, setLocation] = useLocation();
    const [confirmAction, setConfirmAction] = useState<
        null | "delete" | "block"
    >(null);
    const [reviewsOpen, setReviewsOpen] = useState(false);

    const [deleteReasonOpen, setDeleteReasonOpen] = useState(false);
    const [deleteReason, setDeleteReason] = useState<
        "reason1" | "reason2" | "reason3" | "reason4" | "custom"
    >("reason1");
    const [deleteCustomReason, setDeleteCustomReason] = useState("");

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;

            if (reviewsOpen) {
                setReviewsOpen(false);
                return;
            }

            if (deleteReasonOpen) {
                setDeleteReasonOpen(false);
                return;
            }

            if (confirmAction) {
                setConfirmAction(null);
                return;
            }

            onClose();
        };

        window.addEventListener("keydown", onKeyDown);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose, confirmAction, deleteReasonOpen, reviewsOpen]);

    const gallery = post
        ? [
              post.postImg,
              "/figmaAssets/group.png",
              "/figmaAssets/group-3.png",
              "/figmaAssets/component-6.png",
          ]
        : [];

    return (
        <AnimatePresence>
            {open && post ? (
                <motion.div
                    className="fixed inset-0 z-[100]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={() => {
                            if (reviewsOpen) {
                                setReviewsOpen(false);
                                return;
                            }
                            if (deleteReasonOpen) {
                                setDeleteReasonOpen(false);
                                return;
                            }
                            if (confirmAction) {
                                setConfirmAction(null);
                                return;
                            }
                            onClose();
                        }}
                    />

                    {deleteReasonOpen ? (
                        <div
                            className="fixed inset-0 z-[170] flex items-center justify-center"
                            onClick={() => setDeleteReasonOpen(false)}
                        >
                            <div className="absolute inset-0 bg-black/20" />
                            <div
                                className="relative w-[520px] max-w-[calc(100vw-40px)] rounded-[22px] bg-white px-8 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    type="button"
                                    aria-label="Close"
                                    className="absolute right-5 top-5 h-9 w-9 rounded-full hover:bg-[#f6f8fa] flex items-center justify-center"
                                    onClick={() => setDeleteReasonOpen(false)}
                                >
                                    <X className="h-4 w-4 text-[#7b848f]" />
                                </button>

                                <div className="text-[22px] font-semibold text-[#222f36]">
                                    Why Are You Deleting This Post?
                                </div>

                                <div className="mt-7 space-y-4">
                                    {[
                                        {
                                            key: "reason1" as const,
                                            label: "Inappropriate Content",
                                        },
                                        {
                                            key: "reason2" as const,
                                            label: "Spam Content",
                                        },
                                        {
                                            key: "reason3" as const,
                                            label: "Inappropriate Content",
                                        },
                                        {
                                            key: "reason4" as const,
                                            label: "Inappropriate Content",
                                        },
                                    ].map((r) => {
                                        const selected = deleteReason === r.key;
                                        return (
                                            <button
                                                key={r.key}
                                                type="button"
                                                onClick={() =>
                                                    setDeleteReason(r.key)
                                                }
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
                                                    {selected ? (
                                                        <div className="h-[10px] w-[10px] rounded-full bg-[#62a230]" />
                                                    ) : null}
                                                </div>
                                            </button>
                                        );
                                    })}

                                    <div className="w-full rounded-[14px] bg-[#f6f7f9] px-6 py-5">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDeleteReason("custom")
                                            }
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
                                                {deleteReason === "custom" ? (
                                                    <div className="h-[10px] w-[10px] rounded-full bg-[#62a230]" />
                                                ) : null}
                                            </div>
                                        </button>

                                        <textarea
                                            className="mt-4 w-full min-h-[120px] rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 text-[13px] text-[#222f36] outline-none resize-none"
                                            placeholder="Write Something"
                                            value={deleteCustomReason}
                                            onChange={(e) =>
                                                setDeleteCustomReason(
                                                    e.target.value,
                                                )
                                            }
                                            onFocus={() =>
                                                setDeleteReason("custom")
                                            }
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    className="mt-7 h-12 w-full rounded-[12px] bg-[#62a230] text-white hover:bg-[#62a230] hover:text-white"
                                    onClick={() => {
                                        setDeleteReasonOpen(false);
                                        onClose();
                                    }}
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    ) : null}

                    {confirmAction ? (
                        <div
                            className="fixed inset-0 z-[160] flex items-center justify-center"
                            onClick={() => setConfirmAction(null)}
                        >
                            <div className="absolute inset-0 bg-black/20" />
                            <div
                                className="relative w-[620px] max-w-[calc(100vw-40px)] rounded-[16px] bg-white px-10 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    type="button"
                                    aria-label="Close"
                                    className="absolute right-4 top-4 h-9 w-9 rounded-full hover:bg-[#f6f8fa] flex items-center justify-center"
                                    onClick={() => setConfirmAction(null)}
                                >
                                    <X className="h-4 w-4 text-[#7b848f]" />
                                </button>

                                <div className="text-center">
                                    <div className="text-[18px] font-semibold text-[#222f36]">
                                        {confirmAction === "delete"
                                            ? "Are you sure you want to delete this post ?"
                                            : "Are you sure you want to Block this post Temporary ?"}
                                    </div>
                                    <div className="mt-3 text-[12px] text-[#7b848f] leading-5">
                                        Lorem ipsum dolor sit amet consectetur.
                                        In tincidunt a pellentesque gravida
                                        pellentesque suspendisse interdum.
                                        Praesent nisi a nisl et disiator. Non
                                        tortor quis pretium pretium. Vobratium
                                        convallis.
                                    </div>

                                    <div className="mt-8 flex items-center justify-center gap-6">
                                        <Button
                                            type="button"
                                            className="h-10 w-[110px] rounded-[10px] bg-[#62a230] text-white hover:bg-[#62a230] hover:text-white"
                                            onClick={() => {
                                                if (
                                                    confirmAction === "delete"
                                                ) {
                                                    setConfirmAction(null);
                                                    setDeleteReasonOpen(true);
                                                    return;
                                                }

                                                setConfirmAction(null);
                                                onClose();
                                            }}
                                        >
                                            Yes
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-10 w-[110px] rounded-[10px] border-[#e5e7eb] bg-[#f4f5f7] text-[#222f36] hover:bg-[#f4f5f7] hover:text-[#222f36]"
                                            onClick={() =>
                                                setConfirmAction(null)
                                            }
                                        >
                                            No
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <motion.div
                        className="absolute inset-y-0 right-0 w-[90vw] bg-white p-7"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 28,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-full flex flex-col">
                            <div className="h-[64px] px-4 sm:px-6 flex items-center justify-between border-b border-[#edf1f3]">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="h-9 w-9 rounded-full hover:bg-[#f6f8fa] flex items-center justify-center"
                                        aria-label="Back"
                                    >
                                        <ArrowLeft className="h-5 w-5 text-[#222f36]" />
                                    </button>
                                    <div className="text-[#222f36] font-semibold text-sm sm:text-base">
                                        {post.post}
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-full hover:bg-[#f6f8fa]"
                                        >
                                            <MoreHorizontal className="h-5 w-5 text-[#7b848f]" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-52 z-[200]"
                                    >
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onSelect={() => {
                                                setLocation(
                                                    `/posts/edit?id=${post.id}`,
                                                );
                                            }}
                                        >
                                            <Pencil className="h-4 w-4 mr-2 text-[#7b848f]" />
                                            Edit Post
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onSelect={() =>
                                                setConfirmAction("delete")
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 mr-2 text-[#7b848f]" />
                                            Delete Post
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onSelect={() =>
                                                setConfirmAction("block")
                                            }
                                        >
                                            <Ban className="h-4 w-4 mr-2 text-[#7b848f]" />
                                            Block post Temporary
                                        </DropdownMenuItem>
                                        {post.type === "Sponsored" ? (
                                            <DropdownMenuItem
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    onViewInsights?.(post);
                                                }}
                                            >
                                                <BarChart3 className="h-4 w-4 mr-2 text-[#7b848f]" />
                                                View Insights
                                            </DropdownMenuItem>
                                        ) : null}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <div className="px-4 sm:px-6 py-4 grid grid-cols-1 xl:grid-cols-[1.2fr_1fr_360px] gap-4 xl:gap-6">
                                    <div>
                                        <div className="flex items-center justify-between gap-3 mb-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={post.userAvatar}
                                                    alt={post.user}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <div className="leading-tight">
                                                    <div className="text-sm font-semibold text-[#222f36]">
                                                        {post.user}
                                                    </div>
                                                    <div className="text-[11px] text-[#7b848f]">
                                                        14m ago
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    className="ml-3 h-9 rounded-[10px] bg-[#62a230] text-white hover:bg-[#62a230] hover:text-white text-[12px] px-5"
                                                >
                                                    View Profile
                                                </Button>
                                            </div>

                                            <div className="h-10 rounded-[10px] border border-[#f2dbc6] bg-[#fffaf5] px-3 flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    {Array.from({
                                                        length: 5,
                                                    }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={cn(
                                                                "h-4 w-4",
                                                                i < 4
                                                                    ? "text-[#f59e0b] fill-[#f59e0b]"
                                                                    : "text-[#d1d5db]",
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="text-[12px] font-medium text-[#7b848f]">
                                                    4.5
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setReviewsOpen(true)
                                                    }
                                                    className="flex items-center gap-2 text-[12px] text-[#7b848f]"
                                                >
                                                    see reviews
                                                    <ChevronRight className="h-4 w-4 text-[#7b848f]" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="rounded-[14px] border border-[#edf1f3] overflow-hidden bg-white">
                                            <div className="relative">
                                                <img
                                                    src={post.postImg}
                                                    alt="post"
                                                    className="w-full h-[360px] object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[56px] w-[56px] rounded-full bg-black/45 flex items-center justify-center"
                                                >
                                                    <Play className="h-6 w-6 text-white" />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="absolute right-4 top-4 h-10 w-10 rounded-full bg-black/35 backdrop-blur flex items-center justify-center"
                                                >
                                                    <Heart className="h-5 w-5 text-[#ff4d6d] fill-[#ff4d6d]" />
                                                </button>

                                                <div className="absolute left-1/2 bottom-4 -translate-x-1/2 flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-white" />
                                                    <span className="h-2 w-2 rounded-full bg-white/50" />
                                                    <span className="h-2 w-2 rounded-full bg-white/50" />
                                                </div>

                                                <div className="absolute right-4 bottom-4 rounded-full bg-black/55 text-white text-[12px] px-3 py-1.5">
                                                    1/12
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center gap-10 text-[12px] text-[#7b848f]">
                                            <div className="flex items-center gap-2">
                                                <ThumbsUp className="h-5 w-5" />
                                                <span>{post.likes}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MessageCircle className="h-5 w-5" />
                                                <span>{post.comments}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Eye className="h-5 w-5" />
                                                <span>{post.likes * 100}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Share2 className="h-5 w-5" />
                                                <span>50</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center gap-3">
                                            <button
                                                type="button"
                                                className="h-11 w-11 rounded-full bg-white border border-[#edf1f3] flex items-center justify-center"
                                            >
                                                <ChevronLeft className="h-5 w-5 text-[#7b848f]" />
                                            </button>

                                            <div className="flex-1 grid grid-cols-5 gap-3">
                                                {gallery
                                                    .slice(0, 5)
                                                    .map((src, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            className={cn(
                                                                "h-[64px] rounded-[10px] border overflow-hidden bg-[#f6f8fa]",
                                                                idx === 0
                                                                    ? "border-[#222f36]"
                                                                    : "border-[#edf1f3]",
                                                            )}
                                                        >
                                                            <img
                                                                src={src}
                                                                alt="thumb"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </button>
                                                    ))}
                                            </div>

                                            <button
                                                type="button"
                                                className="h-11 w-11 rounded-full bg-white border border-[#edf1f3] flex items-center justify-center"
                                            >
                                                <ChevronRight className="h-5 w-5 text-[#7b848f]" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Card className="rounded-[14px] border border-[#edf1f3] shadow-none">
                                            <CardHeader className="py-3">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-xs font-semibold text-[#222f36]">
                                                        Receipt
                                                    </CardTitle>
                                                    <ChevronRight className="h-4 w-4 text-[#7b848f]" />
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="rounded-[12px] border border-[#edf1f3] bg-[#f6f8fa] overflow-hidden">
                                                    <img
                                                        src="/figmaAssets/group-3.png"
                                                        alt="receipt"
                                                        className="w-full h-[140px] object-cover"
                                                    />
                                                </div>
                                                <div className="mt-3 grid grid-cols-3 gap-2">
                                                    <div className="rounded-[10px] border border-[#f5d0d0] bg-[#fff5f5] p-3 text-center">
                                                        <div className="text-[#ef4343] font-bold text-sm">
                                                            $1000
                                                        </div>
                                                    </div>
                                                    <div className="rounded-[10px] border border-[#edf1f3] bg-white p-3 text-center flex gap-2 justify-center">
                                                        <div className="text-[#111] font-bold text-sm">
                                                            83%
                                                        </div>
                                                        <div className="text-[10px] text-sm text-[#62A230] font-bold ">
                                                            off
                                                        </div>
                                                    </div>
                                                    <div className="rounded-[10px] border border-[#d8f3d1] bg-[#f1f7ec] p-3 text-center">
                                                        <div className="text-[#62A230] font-bold text-sm">
                                                            $340
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="rounded-[14px] border border-[#edf1f3] shadow-none">
                                            <CardHeader className="py-3">
                                                <CardTitle className="text-xs font-semibold text-[#222f36]">
                                                    Details
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="text-[11px] leading-5 text-[#7b848f]">
                                                    Lorem ipsum dolor sit amet
                                                    consectetur. Sit euismod
                                                    aliquam mattis sodales nisl
                                                    at ipsum eu. Senectus magna
                                                    ut cursus pellentesque.
                                                    Molestie eu leo massa amet.
                                                    Scelerisque amet nam nulla
                                                    elit dictumst malesuada
                                                    dolor maecenas. Iaculis
                                                    mattis nulla faucibus amet
                                                    velit sollicitudin neque
                                                    nulla. Eget nisi mattis
                                                    ullamcorper nibh nisl morbi
                                                    ultricies. Id sollicitudin
                                                    ut a lorem sed lectus
                                                    suscipit vehicula proin.
                                                    Maecenas vitae egestas quis
                                                    velit. Adipiscing arcu eget
                                                    eu odio scelerisque mauris
                                                    faucibus hendrerit. Eget
                                                    donec aliquam morbi in
                                                    lectus est euismod elementum
                                                    est. Ornare diam urna at a
                                                    tellus aliquet tortor
                                                    aenean. Consequat morbi ac
                                                    tempus in. Fringilla rhoncus
                                                    imperdiet turpis tristique
                                                    adipiscing. Euismod tellus
                                                    montes donec ultricies
                                                    molestie aliquet in aliquet
                                                    enim. Sit fermentum urna
                                                    ullamcorper eget in sed.
                                                    Pretium orci sit scelerisque
                                                    arcu. Morbi aliquet nec
                                                    cursus tincidunt placerat et
                                                    velit. Sed mauris luctus
                                                    amet sagittis netus massa.
                                                    Purus pulvinar ultricies
                                                    interdum auctor est ac.
                                                    Commodo tortor pharetra
                                                    interdum ultrices adipiscing
                                                    urna. Viverra eu sed mattis
                                                    at egestas amet id
                                                    porttitor. Erat turpis nunc
                                                    in tempus placerat platea
                                                    mauris. Sit nunc eget tellus
                                                    dignissim rutrum amet. Quis
                                                    pulvinar vulputate nec eget
                                                    porta pharetra ante leo.
                                                    Neque enim quam pellentesque
                                                    ullamcorper. Ut amet
                                                    interdum nulla pretium
                                                    venenatis ac ut. Purus diam
                                                    vitae imperdiet quam ac
                                                    tellus. Suspendisse
                                                    adipiscing id.
                                                </div>
                                                <div className="mt-3 text-[11px] text-[#62a230]">
                                                    Read more
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="space-y-4">
                                        <Card className="rounded-[14px] border border-[#edf1f3] shadow-none">
                                            <CardHeader className="py-3">
                                                <CardTitle className="text-xs font-semibold text-[#222f36]">
                                                    Vendor
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={post.userAvatar}
                                                        alt={post.user}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="text-xs font-semibold text-[#222f36]">
                                                            {post.user}
                                                        </div>
                                                        <div className="text-[10px] text-[#7b848f]">
                                                            John Smith
                                                        </div>
                                                    </div>
                                                    <div className="h-9 w-9 rounded-full bg-[#ef4343] flex items-center justify-center">
                                                        <span className="text-white text-xs">
                                                            !
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-[10px] text-[#7b848f] leading-4">
                                                    1234 Sunset Blvd, Los
                                                    Angeles, CA 90026, USA
                                                    <br />
                                                    +34.0522, -118.2437
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="rounded-[14px] border border-[#edf1f3] shadow-none">
                                            <CardContent className="pt-4">
                                                <div className="grid grid-cols-2 gap-y-2 text-[10px]">
                                                    <div className="text-[#7b848f]">
                                                        Category
                                                    </div>
                                                    <div className="text-[#222f36] text-right">
                                                        {post.category}
                                                    </div>
                                                    <div className="text-[#7b848f]">
                                                        Subcategory
                                                    </div>
                                                    <div className="text-[#222f36] text-right">
                                                        {post.subCategory}
                                                    </div>
                                                    <div className="text-[#7b848f]">
                                                        Deal Start Date
                                                    </div>
                                                    <div className="text-[#222f36] text-right">
                                                        {post.startDate}
                                                    </div>
                                                    <div className="text-[#7b848f]">
                                                        Type
                                                    </div>
                                                    <div className="text-[#222f36] text-right">
                                                        {post.type}
                                                    </div>
                                                    <div className="text-[#7b848f]">
                                                        Status
                                                    </div>
                                                    <div className="text-[#222f36] text-right">
                                                        {post.status}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <div className="rounded-[14px] border border-[#edf1f3] overflow-hidden bg-[#f6f8fa]">
                                            <img
                                                src="/figmaAssets/group.png"
                                                alt="preview"
                                                className="w-full h-[160px] object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {reviewsOpen ? (
                            <motion.div
                                className="absolute inset-0 z-[140]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div
                                    className="absolute inset-0 bg-black/35"
                                    onClick={() => setReviewsOpen(false)}
                                />
                                <motion.div
                                    className="absolute right-0 top-0 h-full w-[420px] max-w-[90vw] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
                                    initial={{ x: "100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "100%" }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 28,
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="h-full flex flex-col">
                                        <div className="h-[64px] px-6 flex items-center justify-between border-b border-[#edf1f3]">
                                            <div className="text-[18px] font-semibold text-[#222f36]">
                                                Reviews
                                            </div>
                                            <button
                                                type="button"
                                                className="h-9 w-9 rounded-full hover:bg-[#f6f8fa] flex items-center justify-center"
                                                onClick={() =>
                                                    setReviewsOpen(false)
                                                }
                                            >
                                                <X className="h-4 w-4 text-[#7b848f]" />
                                            </button>
                                        </div>

                                        <div className="flex-1 overflow-y-auto px-6 py-5">
                                            <div className="flex items-center gap-2 text-[#62a230] text-[13px] font-semibold">
                                                <Sparkles className="h-4 w-4" />
                                                Customer says
                                            </div>
                                            <p className="mt-2 text-[12px] text-[#7b848f] leading-5">
                                                Lorem ipsum dolor sit amet
                                                consectetur. In tincidunt a
                                                pellentesque gravida pellentesque
                                                suspendisse interdum. Praesent
                                                risus non id auctor. Non tortor
                                                quis pretium placerat.
                                                Vestibulum convallis .
                                            </p>

                                            <div className="mt-5 flex items-center justify-between">
                                                <div className="text-[12px] text-[#7b848f]">
                                                    902 reviews
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1">
                                                        {Array.from({
                                                            length: 5,
                                                        }).map((_, i) => (
                                                            <Star
                                                                key={`review-star-${i}`}
                                                                className="h-4 w-4 text-[#f59e0b] fill-[#f59e0b]"
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="text-[12px] text-[#222f36] font-semibold">
                                                        4.7
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 space-y-3">
                                                {[
                                                    {
                                                        label: "5 Stars",
                                                        count: 852,
                                                    },
                                                    {
                                                        label: "4 Stars",
                                                        count: 37,
                                                    },
                                                    {
                                                        label: "3 Stars",
                                                        count: 9,
                                                    },
                                                    {
                                                        label: "2 Stars",
                                                        count: 2,
                                                    },
                                                    {
                                                        label: "1 Star",
                                                        count: 2,
                                                    },
                                                ].map((item) => {
                                                    const percent = Math.min(
                                                        100,
                                                        (item.count / 902) *
                                                            100,
                                                    );
                                                    return (
                                                        <div
                                                            key={item.label}
                                                            className="flex items-center gap-3 text-[11px] text-[#7b848f]"
                                                        >
                                                            <div className="w-14">
                                                                {item.label}
                                                            </div>
                                                            <div className="flex-1 h-2 rounded-full bg-[#eef2f6] overflow-hidden">
                                                                <div
                                                                    className="h-full rounded-full bg-[#f59e0b]"
                                                                    style={{
                                                                        width: `${percent}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="w-10 text-right">
                                                                ({item.count})
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="mt-6 space-y-5">
                                                {[
                                                    {
                                                        name: "Wilson Franci",
                                                        rating: 3,
                                                        time: "4w",
                                                        text: "Lorem ipsum dolor sit amet consectetur. Enim viverra sed dictumst posuere aliquet eu consequat. Nullam id odio diam mi ultrices lectus sit. Diam tortor vestibulum eget massa urna tincidunt nibh. Facilisis lacinia in nunc quam fermentum. Praesent.",
                                                    },
                                                    {
                                                        name: "Wilson Franci",
                                                        rating: 3,
                                                        time: "4w",
                                                        text: "Lorem ipsum dolor sit amet consectetur. Enim viverra sed dictumst posuere aliquet eu consequat. Nullam id odio diam mi ultrices lectus sit. Diam tortor vestibulum eget massa urna tincidunt nibh. Facilisis lacinia in nunc quam fermentum. Praesent.",
                                                    },
                                                ].map((review, index) => (
                                                    <div
                                                        key={`${review.name}-${index}`}
                                                        className="flex gap-3"
                                                    >
                                                        <img
                                                            src="/figmaAssets/2-jpg.png"
                                                            alt={review.name}
                                                            className="h-9 w-9 rounded-full object-cover"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <div className="text-[12px] font-semibold text-[#222f36]">
                                                                    {review.name}
                                                                </div>
                                                                <div className="flex items-center gap-1 text-[#f59e0b]">
                                                                    {Array.from({
                                                                        length:
                                                                            review.rating,
                                                                    }).map(
                                                                        (
                                                                            _,
                                                                            i,
                                                                        ) => (
                                                                            <Star
                                                                                key={`r-${index}-${i}`}
                                                                                className="h-3 w-3 text-[#f59e0b] fill-[#f59e0b]"
                                                                            />
                                                                        ),
                                                                    )}
                                                                    <span className="ml-1 text-[11px] text-[#7b848f]">
                                                                        {
                                                                            review.rating
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="mt-1 text-[11px] text-[#7b848f] leading-5">
                                                                {review.text}
                                                            </div>
                                                            <div className="mt-2 text-[10px] text-[#9aa3af]">
                                                                {review.time}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
