"use client";

import { RouteGuard } from "@/components/auth/RouteGuard";
import { SkeletonProvider } from "@/components/dashboard/SkeletonContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect dashboard - requires authentication (any role can access base dashboard)
  return (
    <SkeletonProvider>
      <RouteGuard allowedRoles={["TOURIST", "GUIDE", "ADMIN"]}>
        {children}
      </RouteGuard>
    </SkeletonProvider>
  );
}
