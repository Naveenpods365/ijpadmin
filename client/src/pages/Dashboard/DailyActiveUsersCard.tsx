import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const dauData = [
    { name: "Dec 16", value: 120 },
    { name: "Dec 18", value: 150 },
    { name: "Dec 20", value: 140 },
    { name: "Dec 22", value: 170 },
    { name: "Dec 24", value: 160 },
    { name: "Dec 26", value: 180 },
    { name: "Dec 28", value: 175 },
];

export function DailyActiveUsersCard() {
    return (
        <Card className="bg-white rounded-[10px] border border-[#efefef] shadow-[0px_1px_3px_#00000005,0px_6px_10px_#b1b1b114]">
            <CardHeader className="px-5 pt-5 pb-3 space-y-1">
                <CardTitle className="[font-family:'Poppins',Helvetica] font-semibold text-[#222f36] text-xl">
                    Daily Active Users
                </CardTitle>
                <p className="text-sm text-[#8c8c8c]">Last 14 days trend</p>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dauData}>
                        <defs>
                            <linearGradient
                                id="colorDau"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#21c45d"
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#21c45d"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#edf1f3"
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                            tick={{ fill: "#7b848f", fontSize: 9 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            width={34}
                            tick={{ fill: "#7b848f", fontSize: 9 }}
                            tickFormatter={(value) => `${value}k`}
                        />
                        <Tooltip
                            cursor={{
                                stroke: "#e6eaee",
                                strokeDasharray: "4 4",
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#21c45d"
                            strokeWidth={3}
                            dot={false}
                            fillOpacity={1}
                            fill="url(#colorDau)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
