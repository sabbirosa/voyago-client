"use client";

import { RouteGuard } from "@/components/auth/RouteGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect dashboard - requires authentication (any role can access base dashboard)
  return (
    <RouteGuard allowedRoles={["TOURIST", "GUIDE", "ADMIN"]}>
      {children}
    </RouteGuard>
  );
}
