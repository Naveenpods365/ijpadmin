import { ChevronRightIcon, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const highRiskVendors = [
    {
        name: "AutoLux Parts",
        description: "Unusual discount patterns",
        score: 72,
        transactions: "124,580",
    },
    {
        name: "TechGadgets Pro",
        description: "Receipt format anomalies",
        score: 68,
        transactions: "89,420",
    },
    {
        name: "FashionHub Elite",
        description: "Rapid negative review increase",
        score: 65,
        transactions: "156,200",
    },
    {
        name: "HomeDecor Plus",
        description: "Payment dispute rate spike",
        score: 61,
        transactions: "45,890",
    },
];

export function HighRiskVendorsCard() {
    return (
        <Card className="flex-1 w-full bg-white rounded-xl border border-solid border-[#e0ebe5]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <CardTitle className="font-semibold text-[#12211c] text-lg">
                        High-Risk Vendors
                    </CardTitle>
                </div>
                <Button
                    variant="ghost"
                    className="h-auto text-[#21c45d] hover:text-[#21c45d] hover:bg-transparent p-0"
                >
                    <span className="text-sm">View All</span>
                    <ChevronRightIcon className="w-3 h-3 ml-1" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-3">
                {highRiskVendors.map((vendor, index) => (
                    <div
                        key={index}
                        className="rounded-xl border border-solid border-[#ef43431a] bg-[#ef434305] p-4 flex items-center justify-between hover:bg-[#ef43430a] transition-colors"
                    >
                        <div className="flex flex-col gap-1">
                            <div className="font-semibold text-[#12211c] text-sm">
                                {vendor.name}
                            </div>
                            <div className="text-[#677e77] text-xs">
                                {vendor.description}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className="font-bold text-[#ef4343] text-lg">
                                {vendor.score}
                            </div>
                            <div className="text-[#677e77] text-xs">
                                {vendor.transactions}
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
