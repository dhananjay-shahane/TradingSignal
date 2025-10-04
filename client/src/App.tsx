import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserProfileMenu } from "@/components/UserProfileMenu";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import TradingSignals from "@/pages/TradingSignals";
import UserManagement from "@/pages/UserManagement";
import HistoricalData from "@/pages/HistoricalData";
import FeatureTogglesPage from "@/pages/FeatureTogglesPage";
import UserProfile from "@/pages/UserProfile";

function AuthLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between p-3 md:p-4 border-b shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <UserProfileMenu />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto p-4 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      
      <Route path="/dashboard">
        <AuthLayout>
          <Dashboard />
        </AuthLayout>
      </Route>
      
      <Route path="/signals">
        <AuthLayout>
          <TradingSignals />
        </AuthLayout>
      </Route>
      
      <Route path="/users">
        <AuthLayout>
          <UserManagement />
        </AuthLayout>
      </Route>
      
      <Route path="/history">
        <AuthLayout>
          <HistoricalData />
        </AuthLayout>
      </Route>
      
      <Route path="/features">
        <AuthLayout>
          <FeatureTogglesPage />
        </AuthLayout>
      </Route>

      <Route path="/profile">
        <AuthLayout>
          <UserProfile />
        </AuthLayout>
      </Route>

      <Route>
        <Redirect to="/" />
      </Route>
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
