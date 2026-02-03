import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { DashboardScreen } from "@/pages/DashboardScreen";
import { LoginScreen } from "@/pages/LoginScreen";
import { PostsDealsScreen } from "@/pages/PostsDealsScreen";
import { EditPostScreen } from "@/pages/EditPostScreen";
import { AIIntelligenceCenterScreen } from "@/pages/AIIntelligenceCenterScreen";
import { ContentModerationScreen } from "@/pages/ContentModerationScreen";
import { AdsRevenueScreen } from "@/pages/AdsRevenueScreen";
import { FinancePlansScreen } from "@/pages/FinancePlansScreen";
import { ReportsScreen } from "@/pages/ReportsScreen";
import { SystemAlertsScreen } from "@/pages/SystemAlertsScreen";
import { UsersScreen } from "@/pages/UsersScreen";
import { CommentsScreen } from "@/pages/CommentsScreen";
import { PricingSettingsScreen } from "@/pages/PricingSettingsScreen";
import { AdminManagementScreen } from "@/pages/AdminManagementScreen";
import { ProfileScreen } from "@/pages/ProfileScreen";

function Router() {
    return (
        <Switch>
            {/* Add pages below */}
            <Route path="/" component={DashboardScreen} />
            <Route path="/posts" component={PostsDealsScreen} />
            <Route path="/posts/edit" component={EditPostScreen} />
            <Route
                path="/ai-intelligence"
                component={AIIntelligenceCenterScreen}
            />
            <Route path="/moderation" component={ContentModerationScreen} />
            <Route path="/revenue" component={AdsRevenueScreen} />
            <Route path="/finance" component={FinancePlansScreen} />
            <Route path="/reports" component={ReportsScreen} />
            <Route path="/alerts" component={SystemAlertsScreen} />
            <Route path="/users" component={UsersScreen} />
            <Route path="/comments" component={CommentsScreen} />
            <Route path="/pricing" component={PricingSettingsScreen} />
            <Route path="/admin-management" component={AdminManagementScreen} />
            <Route path="/profile" component={ProfileScreen} />
            <Route path="/login" component={LoginScreen} />
            {/* Fallback to 404 */}
            <Route component={NotFound} />
        </Switch>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Router />
            </TooltipProvider>
        </QueryClientProvider>
    );
}

export default App;
