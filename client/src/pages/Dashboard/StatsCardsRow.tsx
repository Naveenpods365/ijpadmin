import { Card, CardContent } from "@/components/ui/card";

const statsCards = [
    {
        title: "Total Posts",
        value: "1,234",
        icon: "/figmaAssets/frame-1171275704-3.svg",
    },
    {
        title: "Active Users",
        value: "1,234",
        icon: "/figmaAssets/frame-1171275704-2.svg",
    },
    {
        title: "Sponsored Posts",
        value: "1,234",
        icon: "/figmaAssets/frame-1171275704-4.svg",
    },
    {
        title: "Total Revenue",
        value: "1,234",
        icon: "/figmaAssets/frame-1171275704.svg",
    },
    {
        title: "Total Vendors",
        value: "1,234",
        icon: "/figmaAssets/frame-1171275704-1.svg",
    },
    {
        title: "Total Users",
        value: "1,234",
        icon: "/figmaAssets/frame-1171275705.svg",
    },
];

export function StatsCardsRow() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5 w-full">
            {statsCards.map((stat, index) => (
                <Card
                    key={index}
                    className="h-auto bg-white rounded-[15px] shadow-[0px_1px_2px_#0000000d] border-0"
                >
                    <CardContent className="p-[22px_24px] flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-[5.36px]">
                            <p className="[font-family:'Poppins',Helvetica] font-medium text-[#7b848f] text-[11.3px] tracking-[0] leading-[normal]">
                                {stat.title}
                            </p>
                            <p className="[font-family:'Poppins',Helvetica] font-semibold text-[#222f36] text-[22.6px] tracking-[0] leading-[normal]">
                                {stat.value}
                            </p>
                        </div>
                        <img
                            className="w-[48px] h-[48px]"
                            alt={stat.title}
                            src={stat.icon}
                        />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
