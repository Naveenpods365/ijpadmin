import { ChevronRightIcon, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const aiAlerts = [
    {
        emoji: "🔴",
        title: "Fraud Detection",
        description: "Suspicious patterns detected across 14 vendors",
        confidence: "high confidence",
        action: "View Vendors",
        borderColor: "border-[#ef4343]",
        bgGradient:
            "bg-[linear-gradient(90deg,rgba(239,67,67,0.05)_0%,rgba(239,67,67,0)_100%)]",
        titleColor: "text-[#ef4343]",
    },
    {
        emoji: "🟠",
        title: "Vendor Risk",
        description: "Vendor  risk score increased to 72/100",
        confidence: "medium confidence",
        action: "Review Vendor",
        borderColor: "border-[#f59f0a]",
        bgGradient:
            "bg-[linear-gradient(90deg,rgba(245,159,10,0.05)_0%,rgba(245,159,10,0)_100%)]",
        titleColor: "text-[#f59f0a]",
    },
    {
        emoji: "🟢",
        title: "Revenue Intelligence",
        description: "Raising posting fee by 5%  increase MRR by ~$24k",
        confidence: "medium confidence",
        action: "Simulate Pricing",
        borderColor: "border-[#16a249]",
        bgGradient:
            "bg-[linear-gradient(90deg,rgba(22,162,73,0.05)_0%,rgba(22,162,73,0)_100%)]",
        titleColor: "text-[#16a249]",
    },
];

export function AIIntelligenceCard() {
    return (
        <Card className="flex-1 w-full bg-white rounded-xl border border-solid border-[#e0ebe5]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <CardTitle className="font-semibold text-[#12211c] text-lg">
                        AI Intelligence
                    </CardTitle>
                </div>
                <Button
                    variant="ghost"
                    className="h-auto text-[#21c45d] hover:text-[#21c45d] hover:bg-transparent p-0"
                >
                    <span className="text-sm">View Center</span>
                    <ChevronRightIcon className="w-3 h-3 ml-1" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-3">
                {aiAlerts.map((alert, index) => (
                    <div
                        key={index}
                        className={`rounded-xl border-l-4 ${alert.borderColor} ${alert.bgGradient} p-4 flex flex-col justify-between hover:brightness-95 transition-all`}
                    >
                        <div className="space-y-2">
                            <div
                                className={`font-semibold ${alert.titleColor} text-sm`}
                            >
                                {alert.emoji} {alert.title}
                            </div>
                            <div className="font-medium text-[#12211c] text-sm">
                                {alert.description}
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-[#677e77] text-xs">
                                {alert.confidence}
                            </div>
                            <Button
                                variant="ghost"
                                className="h-auto text-[#21c45d] hover:text-[#21c45d] hover:bg-transparent p-0"
                            >
                                <span className="text-xs font-semibold uppercase tracking-wider">
                                    {alert.action} →
                                </span>
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
