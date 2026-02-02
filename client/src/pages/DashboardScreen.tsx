import { AnalyticsSummarySection } from "./Dashboard/AnalyticsSummarySection";
import { DashboardMainSection } from "./Dashboard/DashboardMainSection";
import { UserTableSection } from "./Dashboard/UserTableSection";
import { Sidebar } from "@/components/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const DashboardScreen = (): JSX.Element => {
    return (
        <div className="bg-[#F5F6FA] w-full h-screen overflow-hidden">
            <div className="hidden lg:block fixed inset-y-0 left-0 w-[312px] z-40">
                <Sidebar className="w-[280px]" variant="desktop" />
            </div>

            <main className="h-screen overflow-y-auto no-scrollbar lg:pl-[312px]">
                <div className="flex flex-col items-start gap-[30px] p-[16px] sm:p-[24px] pl-0 sm:pl-[5px] overflow-x-hidden">
                    <div className="w-full flex items-center justify-between lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="bg-white border-[#e0ebe5]"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="p-0 bg-transparent border-0"
                            >
                                <Sidebar
                                    className="w-[280px]"
                                    variant="drawer"
                                />
                            </SheetContent>
                        </Sheet>
                        <div className="text-[#222f36] font-semibold text-lg">
                            Dashboard
                        </div>
                        <div className="w-10" />
                    </div>

                    <DashboardMainSection />
                    <AnalyticsSummarySection />
                    <UserTableSection />
                </div>
            </main>
        </div>
    );
};
