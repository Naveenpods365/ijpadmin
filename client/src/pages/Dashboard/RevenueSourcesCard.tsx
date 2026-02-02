import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const revenueData = [
    { name: "Subscriptions", value: 314000 },
    { name: "Ads Revenue", value: 168000 },
];

const revenueBarColors = ["#22c55e", "#0ea5e9"];

export function RevenueSourcesCard() {
    return (
        <Card className="bg-white rounded-[10px] border border-[#efefef] shadow-[0px_1px_3px_#00000005,0px_6px_10px_#b1b1b114]">
            <CardHeader className="px-5 pt-5 pb-3 space-y-1">
                <CardTitle className="[font-family:'Poppins',Helvetica] font-semibold text-[#222f36] text-xl">
                    Revenue Sources
                </CardTitle>
                <p className="text-sm text-[#8c8c8c]">Monthly breakdown</p>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} layout="vertical">
                        <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            stroke="#edf1f3"
                        />
                        <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                            tick={{ fill: "#7b848f", fontSize: 9 }}
                            tickFormatter={(v) =>
                                `${Math.round(Number(v) / 1000)}k`
                            }
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#7b848f", fontSize: 9 }}
                            width={84}
                        />
                        <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                        <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={68}>
                            {revenueData.map((_, idx) => (
                                <Cell
                                    key={`rev-${idx}`}
                                    fill={
                                        revenueBarColors[
                                            idx % revenueBarColors.length
                                        ]
                                    }
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
