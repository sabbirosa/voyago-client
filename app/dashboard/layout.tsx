"use client";

import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SkeletonProvider } from "@/components/dashboard/SkeletonContext";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { CSSProperties } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect dashboard - requires authentication (any role can access base dashboard)
  return (
    <SkeletonProvider>
      <RouteGuard allowedRoles={["TOURIST", "GUIDE", "ADMIN"]}>
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
            <main className="flex flex-1 flex-col">
              <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                {children}
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </RouteGuard>
    </SkeletonProvider>
  );
}
