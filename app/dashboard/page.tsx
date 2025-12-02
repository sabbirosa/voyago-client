import type { CSSProperties } from "react";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <DashboardPlaceholder
                  title="Dashboard"
                  description="Dashboard is currently under development"
                  badge="Coming soon"
                  content="Dashboard will be available soon for all users to view their bookings and manage their profile."
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
