"use client";

import { useAuth } from "@/lib/auth/useAuth";

export default function DashboardIndexPage() {
  const { role } = useAuth();

  // For Module 1 we keep this simple: just show a role-based message.
  // In later modules this can redirect to specific sub-dashboards.
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Welcome to your Voyago dashboard</h2>
      <p className="text-sm text-muted-foreground">
        Current role: {role ?? "not assigned yet"}. Detailed tourist / guide / admin dashboards
        will be implemented in later modules.
      </p>
    </div>
  );
}


