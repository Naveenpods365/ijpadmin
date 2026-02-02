import style from "./Style.module.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const userOverviewData = [
    { name: "Vendors", value: 14000, color: "#e3b40e" },
    { name: "Users", value: 102000, color: "#62a230" },
];

export function UserOverviewCard() {
    return (
        <Card className="bg-white rounded-[10px] border border-[#efefef] shadow-[0px_1px_3px_#00000005,0px_6px_10px_#b1b1b114]">
            <CardHeader>
                <CardTitle
                    className={`${style.textCard} [font-family:'Poppins',Helvetica] font-semibold text-[#222f36] text-xl`}
                >
                    User Overview
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
                    <div className="w-full max-w-[320px] h-[280px] mx-auto overflow-visible">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart
                                margin={{
                                    top: 12,
                                    right: 12,
                                    bottom: 12,
                                    left: 12,
                                }}
                            >
                                <Pie
                                    data={userOverviewData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={104}
                                    startAngle={90}
                                    endAngle={-270}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="#ffffff"
                                    strokeWidth={6}
                                >
                                    {userOverviewData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex-1 w-full md:w-auto pt-2 md:pt-12">
                        <div className="space-y-10">
                            <div className="flex items-start gap-5">
                                <div
                                    className="mt-2.5 w-4 h-4 rounded-full"
                                    style={{ backgroundColor: "#e3b40e" }}
                                />
                                <div>
                                    <div className="text-[30px] leading-[36px] font-semibold text-[#222f36]">
                                        14k
                                    </div>
                                    <div className="text-[13px] leading-[18px] text-[#222f36]">
                                        Vendors
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-5">
                                <div
                                    className="mt-2.5 w-4 h-4 rounded-full"
                                    style={{ backgroundColor: "#62a230" }}
                                />
                                <div>
                                    <div className="text-[30px] leading-[36px] font-semibold text-[#222f36]">
                                        102k
                                    </div>
                                    <div className="text-[13px] leading-[18px] text-[#222f36]">
                                        Users
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
