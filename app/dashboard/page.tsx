"use client";

import { useAuth } from "@/lib/auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder";

export default function DashboardPage() {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && role) {
      // Redirect to role-specific dashboard
      if (role === "TOURIST") {
        router.replace("/dashboard/tourist");
      } else if (role === "GUIDE") {
        router.replace("/dashboard/guide");
      } else if (role === "ADMIN") {
        router.replace("/dashboard/admin");
      }
    }
  }, [user, role, isLoading, router]);

  if (isLoading) {
    return (
      <DashboardPlaceholder
        title="Loading Dashboard"
        description="Please wait while we load your dashboard..."
      />
    );
  }

  // Show placeholder while redirecting
  return (
    <DashboardPlaceholder
      title="Dashboard"
      description="Redirecting to your dashboard..."
    />
  );
}
