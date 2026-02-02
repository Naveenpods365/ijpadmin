import { HighRiskVendorsCard } from "./HighRiskVendorsCard";
import { AIIntelligenceCard } from "./AIIntelligenceCard";
import { PlatformOverviewsCard } from "./PlatformOverviewsCard";

export const AnalyticsSummarySection = (): JSX.Element => {
    return (
        <div className="flex w-full items-start gap-6 relative flex-col xl:flex-row">
            <HighRiskVendorsCard />
            <AIIntelligenceCard />
            <PlatformOverviewsCard />
        </div>
    );
};
