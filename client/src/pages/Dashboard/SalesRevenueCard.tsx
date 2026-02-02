import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import style from "./Style.module.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";

const salesData = [
    { name: "2 Oct", value: 100 },
    { name: "3 Oct", value: 120 },
    { name: "4 Oct", value: 150 },
    { name: "5 Oct", value: 130 },
    { name: "6 Oct", value: 180 },
    { name: "7 Oct", value: 160 },
    { name: "8 Oct", value: 200 },
    { name: "9 Oct", value: 190 },
];

function SalesTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{ value?: number }>;
    label?: string;
}) {
    if (!active || !payload?.length) return null;
    const value = payload[0]?.value;

    return (
        <div className="bg-white border border-[#edf1f3] rounded-md shadow-sm px-4 py-3">
            <div className="text-[#222f36] text-sm font-semibold">{label}</div>
            <div className="mt-1 text-[#62a230] text-sm">
                value : <span className="font-semibold">{value}</span>
            </div>
        </div>
    );
}

export function SalesRevenueCard({
    date,
    onDateChange,
}: {
    date: DateRange | undefined;
    onDateChange: (next: DateRange | undefined) => void;
}) {
    return (
        <Card
            className={`${style.textCard} [bg-white rounded-[12px] border border-[#efefef] shadow-[0px_1px_3px_#00000005,0px_6px_10px_#b1b1b114]}`}
        >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle
                    className={`${style.textCard} [ font-semibold text-[#12211c] text-xl`}
                >
                    Sales Revenue
                </CardTitle>
                <Popover>
                    <PopoverTrigger asChild>
                        <div className="flex items-center gap-[5px] px-3 py-2 bg-white rounded-[5px] border-[0.5px] border-[#7a838e] cursor-pointer hover:bg-gray-50 transition-colors">
                            <CalendarIcon className="w-4 h-4 text-[#7b848f]" />
                            <span className="[font-family:'Poppins',Helvetica] font-normal text-[#7b848f] text-xs">
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "d MMM")} to{" "}
                                            {format(date.to, "d MMM , yyyy")}
                                        </>
                                    ) : (
                                        format(date.from, "d MMM , yyyy")
                                    )
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </span>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={onDateChange}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </CardHeader>
            <CardContent className="h-[260px] pt-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                        <defs>
                            <linearGradient
                                id="colorValue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#62a230"
                                    stopOpacity={0}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#62a230"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="12 3"
                            vertical={false}
                            stroke="#8c8787ff"
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                            tick={{ fill: "#7b848f", fontSize: 10 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            width={30}
                            tick={{ fill: "#919498ff", fontSize: 10 }}
                        />
                        <Tooltip
                            cursor={{
                                stroke: "#919498ff",
                                strokeDasharray: "4 4",
                            }}
                            content={<SalesTooltip />}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#62a230"
                            strokeWidth={4}
                            dot={false}
                            activeDot={{
                                r: 6,
                                stroke: "#fff",
                                strokeWidth: 2,
                                fill: "#62a230",
                            }}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
