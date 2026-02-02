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

function Router() {
    return (
        <Switch>
            {/* Add pages below */}
            <Route path="/" component={DashboardScreen} />
            <Route path="/posts" component={PostsDealsScreen} />
            <Route path="/posts/edit" component={EditPostScreen} />
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
