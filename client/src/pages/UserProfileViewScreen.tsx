import { useEffect, useMemo, useState } from "react";
import {
    LayoutGrid,
    LayoutList,
    Mail,
    MapPin,
    Monitor,
    MoreHorizontal,
    Phone,
    Star,
    StarHalf,
    UserMinus,
    UserX,
    X,
    Loader2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserDetail, useBlockUser } from "@/hooks/useUsers";
import { getAvatarUrl } from "@/lib/utils";

type UserProfileViewScreenProps = {
    params: {
        id: string;
    };
};

const galleryImages = [
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1502764613149-7f1d229e230f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
] as const;

type FollowRow = {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isFollowing: boolean;
};

function BlockConfirmModal({
    open,
    name,
    avatar,
    onClose,
    onConfirm,
    isPending,
}: {
    open: boolean;
    name: string;
    avatar: string;
    onClose: () => void;
    onConfirm: () => void;
    isPending: boolean;
}) {
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open ? (
                <motion.div
                    className="fixed inset-0 z-[170] "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div
                        className="absolute inset-0 bg-black/25"
                        onClick={onClose}
                    />

                    <motion.div
                        className="absolute inset-0 flex items-center justify-center px-4"
                        initial={{ opacity: 0, scale: 0.97, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: 8 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 22,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full max-w-[720px] rounded-[34px] bg-white shadow-[0px_18px_45px_rgba(0,0,0,0.18)] border border-[#eef2f6] relative">
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute right-4 top-4 h-9 w-9 rounded-full hover:bg-[#f6f8fa] flex items-center justify-center"
                                aria-label="Close"
                            >
                                <X className="h-4 w-4 text-[#222f36]" />
                            </button>

                            <div className="px-8 pt-8 pb-7">
                                <div className="flex flex-col items-center text-center">
                                    <div className="h-[106px] w-[106px] rounded-full overflow-hidden bg-[#f6f8fa] border border-[#eef2f6]">
                                        <img
                                            src={avatar}
                                            alt={name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="mt-2 text-[18px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                        {name}
                                    </div>

                                    <div className="mt-4 text-[19px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                        Are you sure you want to block this post
                                        User ?
                                    </div>
                                    <div className="mt-2 text-[11px] leading-5 text-[#7b848f] [font-family:'Poppins',Helvetica] max-w-[420px]">
                                        Lorem ipsum dolor sit amet consectetur.
                                        In tincidunt a pellentesque gravida
                                        pellentesque suspendisse interdum.
                                        Placerat risus non id auctor. Non tortor
                                        quis pretium placerat vestibulum
                                        convallis.
                                    </div>

                                    <div className="mt-6 flex items-center justify-center gap-6">
                                        <button
                                            type="button"
                                            onClick={onConfirm}
                                            disabled={isPending}
                                            className="h-9 w-[120px] rounded-[8px] bg-[#ef4444] text-white text-[12px] font-semibold [font-family:'Poppins',Helvetica] flex items-center justify-center disabled:opacity-50"
                                        >
                                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Block"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            disabled={isPending}
                                            className="h-9 w-[120px] rounded-[8px] bg-[#f3f4f6] text-[#111827] text-[12px] font-semibold [font-family:'Poppins',Helvetica]"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}

function FollowListDrawer({
    open,
    title,
    count,
    rows,
    onClose,
}: {
    open: boolean;
    title: string;
    count: string;
    rows: FollowRow[];
    onClose: () => void;
}) {
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", onKeyDown);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open ? (
                <motion.div
                    className="fixed inset-0 z-[160]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div
                        className="absolute inset-0 bg-black/25"
                        onClick={onClose}
                    />

                    <motion.div
                        className="absolute inset-y-0 right-0 w-[92vw] max-w-[420px] bg-[#FBFBFB]"
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
                            <div className="h-[72px] px-6 flex items-center justify-between border-b border-[#eef2f6]">
                                <div className="flex items-center gap-3">
                                    <div className="text-[18px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                        {title}
                                    </div>
                                    <div className="text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        {count}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="h-9 w-9 rounded-full hover:bg-[#f6f8fa] flex items-center justify-center"
                                    aria-label="Close"
                                >
                                    <X className="h-4 w-4 text-[#222f36]" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar">
                                <div className="px-6 py-5 space-y-4">
                                    {rows.map((r) => (
                                        <div
                                            key={r.id}
                                            className="flex items-center justify-between rounded bg-white border-[#111] p-4"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-[44px] w-[44px] rounded-full overflow-hidden bg-[#f6f8fa] border border-[#eef2f6]">
                                                    <img
                                                        src={r.avatar}
                                                        alt={r.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="leading-tight">
                                                    <div className="text-[12px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                                        {r.name}
                                                    </div>
                                                    <div className="mt-1 text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                                        @{r.username}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                className={`h-8 min-w-[92px] px-4 rounded text-[11px] font-semibold [font-family:'Poppins',Helvetica] transition-colors ${
                                                    r.isFollowing
                                                        ? "bg-[#eff7ea] text-[#62a230] border border-[#d9ecd0]"
                                                        : "bg-[#62a230] text-white"
                                                }`}
                                            >
                                                {r.isFollowing
                                                    ? "Following"
                                                    : "Follow"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}

export function UserProfileViewScreen({ params }: UserProfileViewScreenProps) {
    const [tab, setTab] = useState<"all" | "sponsored" | "fav">("all");
    const [followDrawer, setFollowDrawer] = useState<
        null | "followers" | "following"
    >(null);
    const [blockModalOpen, setBlockModalOpen] = useState(false);
    const [, setLocation] = useLocation();

    // Fetch user details
    const { data: userData, isLoading, isError } = useUserDetail(params.id);
    const blockMutation = useBlockUser();

    // Redirect if invalid ID or go back if error (optional logic, kept simple)
    if (isError) {
        // Maybe show error UI or redirect
        // For now let's just show minimal error in main content
    }

    const user = userData?.data;

    const profileName = useMemo(() => {
        if (!user) return "Loading...";
        if (user.businessName) return user.businessName;
        if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
        return user.firstName || user.username || user.email;
    }, [user]);

    const profileStats = useMemo(
        () => ({
            followers: "0", // Not in API yet
            following: "0", // Not in API yet
            positive: user?.rating ? `${user.rating * 20}%` : "0%", // Example conversion if rating is 0-5
            posts: "0", // Not in API yet
        }),
        [user],
    );

    // Mocks for now as API doesn't return followers/following
    const followersRows = useMemo<FollowRow[]>(() => [], []);
    const followingRows = useMemo<FollowRow[]>(() => [], []);

    const aboutText = user?.about || "No bio provided.";

    const visibleImages = useMemo(() => {
        if (tab === "sponsored") return galleryImages.slice(0, 3);
        if (tab === "fav") return galleryImages.slice(2, 6);
        return galleryImages;
    }, [tab]);

    const avatarSrc = getAvatarUrl(user?.avatarKey);

    const displayLocation = user?.registeredAddress || (user?.zipCode ? `${user.zipCode}, USA` : "Location not set");
    const displayPhone = user?.mobileNumber || "Not provided";
    const displayEmail = user?.email || "Not provided";

    const categoryTag = useMemo(() => {
        if (user?.accountType === "VENDOR" && user.businessType) {
            return user.businessType;
        }
        if (user?.interests && user.interests.length > 0) {
            return user.interests[0];
        }
        if (user?.accountType) return user.accountType;
        return "User";
    }, [user]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f3f5f6] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#62a230]" />
            </div>
        );
    }

    if (!user) {
        return (
             <div className="min-h-screen bg-[#f3f5f6] flex items-center justify-center text-[#7b848f]">
                User not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3f5f6]">
            <BlockConfirmModal
                open={blockModalOpen}
                name={profileName}
                avatar={avatarSrc}
                onClose={() => setBlockModalOpen(false)}
                onConfirm={() => {
                    blockMutation.mutate(user._id, {
                        onSuccess: () => {
                            setBlockModalOpen(false);
                            // Maybe redirect or refetch
                        }
                    });
                }}
                isPending={blockMutation.isPending}
            />
            <FollowListDrawer
                open={followDrawer === "followers"}
                title="Followers"
                count={profileStats.followers}
                rows={followersRows}
                onClose={() => setFollowDrawer(null)}
            />
            <FollowListDrawer
                open={followDrawer === "following"}
                title="Following"
                count={profileStats.following}
                rows={followingRows}
                onClose={() => setFollowDrawer(null)}
            />
            <div className="hidden lg:block fixed inset-y-0 left-0 w-[312px] z-40">
                <Sidebar className="w-[280px]" variant="desktop" />
            </div>

            <main className="min-h-screen overflow-y-auto no-scrollbar lg:pl-[292px]">
                <div className="px-4 pt-6 pb-10 lg:px-8">
                    <div className="rounded-[18px] bg-white shadow-sm overflow-hidden relative">
                        <div className="relative h-[200px]">
                            <img
                                src="/figmaAssets/profileheader.png"
                                alt="user header"
                                className="h-full w-full object-cover relative z-0"
                            />
                        </div>

                        <div className="relative px-6 pb-6 pt-4 z-10 ">
                            <div className="absolute left-6 top-22 mt-[-92px] h-[154px] w-[154px] rounded-full overflow-hidden border-4 border-white shadow-lg bg-white z-30">
                                <img
                                    src={avatarSrc}
                                    alt={profileName}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="flex items-center gap-4 pl-[190px]">
                                <div className="min-w-[180px]">
                                    <div className="text-[18px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                        {profileName}
                                    </div>
                                    <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-[#eaf1ff] px-3 py-1 text-[11px] text-[#2563eb] [font-family:'Poppins',Helvetica]">
                                        <Monitor className="h-3 w-3" />
                                        {categoryTag}
                                    </div>
                                </div>

                                <div className="hidden lg:flex flex-1 items-center justify-center">
                                    <div className="h-10 w-px bg-[#e5e7eb]" />
                                    <div className="ml-10 flex items-center gap-10 text-center text-[12px] text-[#6b7280] [font-family:'Poppins',Helvetica]">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFollowDrawer("followers")
                                            }
                                            className="min-w-[64px] hover:opacity-90"
                                        >
                                            <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                                {profileStats.followers}
                                            </div>
                                            Followers
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFollowDrawer("following")
                                            }
                                            className="min-w-[64px] hover:opacity-90"
                                        >
                                            <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                                {profileStats.following}
                                            </div>
                                            Following
                                        </button>
                                        <div className="min-w-[64px]">
                                            <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                                {profileStats.positive}
                                            </div>
                                            Positive
                                        </div>
                                        <div className="min-w-[64px]">
                                            <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                                {profileStats.posts}
                                            </div>
                                            Post
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-40">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                type="button"
                                                className="h-9 w-9 rounded-[8px] border border-[#3b82f6] bg-white flex items-center justify-center"
                                                aria-label="More"
                                            >
                                                <MoreHorizontal className="h-4 w-4 text-[#3b82f6]" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-60 rounded-[12px] z-[99999]"
                                        >
                                            <DropdownMenuItem
                                                className="cursor-pointer flex items-center gap-2 [font-family:'Poppins',Helvetica]"
                                                onSelect={() =>
                                                    setBlockModalOpen(true)
                                                }
                                            >
                                                <UserX className="h-4 w-4 text-[#7b848f]" />
                                                Block
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 [font-family:'Poppins',Helvetica]">
                                                <UserMinus className="h-4 w-4 text-[#7b848f]" />
                                                Suspend User Account
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-center lg:hidden">
                                <div className="flex items-center gap-10 text-center text-[12px] text-[#6b7280] [font-family:'Poppins',Helvetica]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFollowDrawer("followers")
                                        }
                                        className="min-w-[64px] hover:opacity-90"
                                    >
                                        <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                            {profileStats.followers}
                                        </div>
                                        Followers
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFollowDrawer("following")
                                        }
                                        className="min-w-[64px] hover:opacity-90"
                                    >
                                        <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                            {profileStats.following}
                                        </div>
                                        Following
                                    </button>
                                    <div className="min-w-[64px]">
                                        <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                            {profileStats.positive}
                                        </div>
                                        Positive
                                    </div>
                                    <div className="min-w-[64px]">
                                        <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                            {profileStats.posts}
                                        </div>
                                        Post
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-5 lg:grid-cols-[360px_1fr]">
                        <Card className="rounded-[16px] border-0 bg-white shadow-sm">
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-2 text-[#f97316]">
                                    <Star className="h-4 w-4 fill-[#f97316]" />
                                    <Star className="h-4 w-4 fill-[#f97316]" />
                                    <Star className="h-4 w-4 fill-[#f97316]" />
                                    <Star className="h-4 w-4 fill-[#f97316]" />
                                    <StarHalf className="h-4 w-4 fill-[#f97316]" />
                                    <span className="ml-2 text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        {user?.rating ? user.rating : "0.0"}
                                    </span>
                                </div>

                                <div className="text-[14px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                    About
                                </div>
                                <div className="text-[11px] text-[#7b848f] leading-5 [font-family:'Poppins',Helvetica]">
                                    {aboutText}
                                </div>

                                <div className="pt-2">
                                    <div className="flex items-center justify-between text-[11px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                        <span>Profile Completion</span>
                                        <span>50 %</span>
                                    </div>
                                    <div className="mt-2 h-2 rounded-full bg-[#eef2f6] overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-[#4f8ef9]"
                                            style={{ width: "50%" }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[12px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica] mt-[6rem]">
                                        Contact Info
                                    </div>
                                    <div className="mt-3 space-y-3 rounded-[12px] bg-[#f7f7f7] p-4">
                                        <div className="flex items-center gap-3 text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                            <span className="h-9 w-9 rounded-full bg-white flex items-center justify-center">
                                                <Phone className="h-4 w-4 text-[#62a230]" />
                                            </span>
                                            {displayPhone}
                                        </div>
                                        <div className="flex items-center gap-3 text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                            <span className="h-9 w-9 rounded-full bg-white flex items-center justify-center">
                                                <Mail className="h-4 w-4 text-[#62a230]" />
                                            </span>
                                            {displayEmail}
                                        </div>
                                        <div className="flex items-center gap-3 text-[12px] text-[#7b848f] [font-family:'Poppins',Helvetica]">
                                            <span className="h-9 w-9 rounded-full bg-white flex items-center justify-center">
                                                <MapPin className="h-4 w-4 text-[#62a230]" />
                                            </span>
                                            {displayLocation}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="rounded-[16px] border-0 bg-white shadow-sm">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setTab("all")}
                                            className={`h-7 px-5 rounded-full text-[11px] [font-family:'Poppins',Helvetica] ${
                                                tab === "all"
                                                    ? "bg-[#eff7ea] text-[#62a230] font-semibold"
                                                    : "border border-[#edf1f3] text-[#7b848f] font-medium"
                                            }`}
                                        >
                                            All
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setTab("sponsored")}
                                            className={`h-7 px-5 rounded-full text-[11px] [font-family:'Poppins',Helvetica] ${
                                                tab === "sponsored"
                                                    ? "bg-[#eff7ea] text-[#62a230] font-semibold"
                                                    : "border border-[#edf1f3] text-[#7b848f] font-medium"
                                            }`}
                                        >
                                            Sponsored Post
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setTab("fav")}
                                            className={`h-7 px-5 rounded-full text-[11px] [font-family:'Poppins',Helvetica] ${
                                                tab === "fav"
                                                    ? "bg-[#eff7ea] text-[#62a230] font-semibold"
                                                    : "border border-[#edf1f3] text-[#7b848f] font-medium"
                                            }`}
                                        >
                                            Fav posts
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <LayoutGrid className="h-4 w-4 text-[#62a230]" />
                                        <LayoutList className="h-4 w-4 text-[#c7cdd6]" />
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                                    {visibleImages.map((src) => (
                                        <div
                                            key={src}
                                            className="h-[228px] sm:h-[235px] rounded-[14px] bg-cover bg-center"
                                            style={{
                                                backgroundImage: `url(${src})`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
