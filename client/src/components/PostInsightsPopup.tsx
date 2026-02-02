import { useEffect, useMemo } from "react";
import {
    ArrowLeft,
    ChevronDown,
    ChevronRight,
    MapPin,
    Users,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PostDetailData } from "@/components/PostDetailPopup";

type PostInsightsPopupProps = {
    open: boolean;
    post: PostDetailData | null;
    onClose: () => void;
};

export function PostInsightsPopup({
    open,
    post,
    onClose,
}: PostInsightsPopupProps) {
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

    const barData = useMemo(() => {
        if (!post) return [];
        const base = 20 + (post.id % 7);
        const days = [
            "20 jun",
            "21 jun",
            "22 jun",
            "23 jun",
            "24 jun",
            "25 jun",
            "26 jun",
        ];
        return days.map((d, idx) => ({
            day: d,
            value: Math.max(8, Math.round(base + idx * 6 + (post.likes % 9))),
        }));
    }, [post]);

    const activeBarIndex = 1;
    const activeDay = barData[activeBarIndex]?.day;

    const reach = useMemo(() => {
        if (!post) return 0;
        return 93000 + post.id * 100 + post.comments * 10;
    }, [post]);

    const donut = useMemo(() => {
        const total = 120000;
        const reached = Math.min(total, reach);
        return [
            { name: "Reached", value: reached },
            { name: "Remaining", value: Math.max(0, total - reached) },
        ];
    }, [reach]);

    const donutPct = useMemo(() => {
        const total = donut[0].value + donut[1].value;
        if (!total) return 0;
        return donut[0].value / total;
    }, [donut]);

    const AxisTick = (props: any) => {
        const { x, y, payload } = props;
        const isActive = payload?.value === activeDay;
        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={10}
                    textAnchor="middle"
                    fill={isActive ? "#62a230" : "#7b848f"}
                    fontSize={10}
                >
                    {payload?.value}
                </text>
            </g>
        );
    };

    const BarWithBubble = (barProps: any) => {
        const { x, y, width, height, fill, index, value } = barProps;
        const showBubble = index === activeBarIndex;
        const bubbleW = 86;
        const bubbleH = 34;
        const bubbleX = x + width / 2 - bubbleW / 2;
        const bubbleY = y - bubbleH - 14;

        return (
            <g>
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={6}
                    ry={6}
                    fill={fill}
                />

                {showBubble ? (
                    <foreignObject
                        x={bubbleX}
                        y={bubbleY}
                        width={bubbleW}
                        height={bubbleH + 14}
                        style={{ overflow: "visible" }}
                    >
                        <div style={{ width: bubbleW }}>
                            <div className="w-full bg-white border border-[#edf1f3] shadow-sm rounded-[10px] px-3 py-2 text-[#62a230] text-[12px] font-semibold flex items-center justify-center gap-2">
                                <Users className="h-4 w-4" />
                                500
                            </div>
                            <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white mx-auto" />
                            <div className="w-0 h-0 border-l-[9px] border-r-[9px] border-t-[9px] border-l-transparent border-r-transparent border-t-[#edf1f3] mx-auto -mt-[9px]" />
                        </div>
                    </foreignObject>
                ) : null}
            </g>
        );
    };

    return (
        <AnimatePresence>
            {open && post ? (
                <motion.div
                    className="fixed inset-0 z-[120]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={onClose}
                    />

                    <motion.div
                        className="absolute inset-y-0 right-0 w-[90vw] max-w-[1100px] bg-white"
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
                                        Post Insights
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <div className="p-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-[14px] text-[#222f36] font-medium">
                                                    Last 7 Days
                                                    <ChevronDown className="h-4 w-4 text-[#7b848f]" />
                                                </div>
                                                <div className="text-[12px] text-[#9aa3ad]">
                                                    20 June to 26 June
                                                </div>
                                            </div>

                                            <div className="mt-6 h-[220px]">
                                                <ResponsiveContainer
                                                    width="100%"
                                                    height="100%"
                                                >
                                                    <BarChart
                                                        data={barData}
                                                        margin={{
                                                            top: 54,
                                                            right: 10,
                                                            left: 0,
                                                            bottom: 0,
                                                        }}
                                                    >
                                                        <XAxis
                                                            dataKey="day"
                                                            tick={<AxisTick />}
                                                            axisLine={false}
                                                            tickLine={false}
                                                        />
                                                        <Bar
                                                            dataKey="value"
                                                            radius={[
                                                                6, 6, 6, 6,
                                                            ]}
                                                            barSize={26}
                                                            shape={
                                                                <BarWithBubble />
                                                            }
                                                        >
                                                            {barData.map(
                                                                (_, idx) => (
                                                                    <Cell
                                                                        key={
                                                                            idx
                                                                        }
                                                                        fill={
                                                                            idx ===
                                                                            activeBarIndex
                                                                                ? "#62a230"
                                                                                : "#b7d79c"
                                                                        }
                                                                    />
                                                                ),
                                                            )}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-[14px] font-semibold text-[#222f36]">
                                                Reach
                                            </div>
                                            <div className="mt-6 h-[240px] relative">
                                                <ResponsiveContainer
                                                    width="100%"
                                                    height="100%"
                                                >
                                                    <PieChart>
                                                        <Pie
                                                            data={[
                                                                { value: 1 },
                                                            ]}
                                                            dataKey="value"
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={86}
                                                            outerRadius={100}
                                                            startAngle={225}
                                                            endAngle={-45}
                                                            stroke="none"
                                                            cornerRadius={20}
                                                            fill="#e9f3e4"
                                                            isAnimationActive={
                                                                false
                                                            }
                                                        />

                                                        <Pie
                                                            data={[
                                                                {
                                                                    value: donutPct,
                                                                },
                                                                {
                                                                    value: Math.max(
                                                                        0,
                                                                        1 -
                                                                            donutPct,
                                                                    ),
                                                                },
                                                            ]}
                                                            dataKey="value"
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={86}
                                                            outerRadius={100}
                                                            startAngle={225}
                                                            endAngle={-45}
                                                            stroke="none"
                                                            cornerRadius={20}
                                                            isAnimationActive={
                                                                false
                                                            }
                                                        >
                                                            <Cell fill="#62a230" />
                                                            <Cell fill="rgba(0,0,0,0)" />
                                                        </Pie>
                                                    </PieChart>
                                                </ResponsiveContainer>

                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <div className="text-[40px] font-semibold text-[#222f36] leading-none">
                                                        {Math.round(
                                                            reach / 1000,
                                                        )}
                                                        k
                                                    </div>
                                                    <div className="mt-1 text-[12px] text-[#7b848f]">
                                                        Account Reached
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <div className="text-[14px] font-semibold text-[#222f36]">
                                            Overview
                                        </div>

                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 text-[13px]">
                                            <div className="flex items-center justify-between py-1">
                                                <div className="text-[#7b848f]">
                                                    Content interaction
                                                </div>
                                                <div className="text-[#222f36]">
                                                    850k
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between py-1">
                                                <div className="text-[#7b848f]">
                                                    Account Reached
                                                </div>
                                                <div className="text-[#222f36]">
                                                    {Math.round(reach / 1000)}k
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between py-1">
                                                <div className="text-[#7b848f]">
                                                    Profile Visits
                                                </div>
                                                <div className="text-[#222f36]">
                                                    600k
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12">
                                        <div className="text-[16px] font-semibold text-[#222f36]">
                                            Sponsored details
                                        </div>

                                        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div className="space-y-5">
                                                <Card className="rounded-[14px] border border-[#edf1f3] shadow-none">
                                                    <CardContent className="p-6">
                                                        <div className="text-[14px] font-medium text-[#222f36]">
                                                            Send Message
                                                        </div>
                                                        <div className="mt-1 text-[12px] text-[#9aa3ad]">
                                                            @Sitra Arlina
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card className="rounded-[14px] border border-[#edf1f3] shadow-none">
                                                    <CardContent className="p-6">
                                                        <div className="text-[14px] font-medium text-[#222f36]">
                                                            Audience
                                                        </div>

                                                        <div className="mt-4 h-10 rounded-[12px] border border-[#edf1f3] bg-[#f6f8fa] flex items-center gap-2 px-3 text-[12px] text-[#7b848f]">
                                                            <MapPin className="h-4 w-4" />
                                                            kolkata ,Orissa
                                                            ,153004
                                                        </div>

                                                        <div className="mt-4 flex flex-wrap gap-3">
                                                            {[
                                                                "Travel",
                                                                "Travel",
                                                                "Travel",
                                                            ].map((t, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="h-9 px-6 rounded-full bg-[#f6f8fa] text-[12px] text-[#7b848f] flex items-center"
                                                                >
                                                                    {t}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            <Card className="rounded-[14px] border border-[#edf1f3] shadow-none">
                                                <CardContent className="p-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-[14px] font-medium text-[#222f36]">
                                                            Total spend
                                                        </div>
                                                        <div className="text-[14px] text-[#222f36]">
                                                            $400{" "}
                                                            <span className="text-[13px] text-[#7b848f]">
                                                                over 5 days
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 border-t border-dashed border-[#e5e7eb]" />

                                                    <div className="mt-6 space-y-4 text-[13px]">
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-[#7b848f]">
                                                                Ad Started Date
                                                            </div>
                                                            <div className="text-[#222f36]">
                                                                21 Dec 2024
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start justify-between">
                                                            <div className="text-[#7b848f]">
                                                                Ad End Date
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-[#222f36]">
                                                                    25 Dec 2024
                                                                </div>
                                                                <div className="text-[12px] text-[#62a230]">
                                                                    5 days left
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
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
