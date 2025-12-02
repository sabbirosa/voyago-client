"use client";

import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useSkeleton } from "@/components/dashboard/SkeletonContext";
import type { UserRole } from "@/lib/auth/useAuth";
import { useAuth } from "@/lib/auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * Route Guard Component
 * Protects routes based on authentication and role requirements
 *
 * Pages can set their skeleton using the useSkeleton hook.
 * The skeleton will be shown during authentication loading.
 */
export function RouteGuard({
  children,
  allowedRoles,
  redirectTo = "/login",
}: RouteGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { skeleton } = useSkeleton();

  useEffect(() => {
    if (isLoading) return;

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      router.push(redirectTo);
      return;
    }

    // Check role-based access if roles are specified
    if (allowedRoles && allowedRoles.length > 0) {
      if (!user.role || !allowedRoles.includes(user.role)) {
        // Redirect based on user's role
        if (user.role === "ADMIN") {
          router.push("/dashboard/admin");
        } else if (user.role === "GUIDE") {
          router.push("/dashboard/guide");
        } else {
          router.push("/dashboard");
        }
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, redirectTo, router]);

  // Show loading state with skeleton
  if (isLoading) {
    return <DashboardSkeleton>{skeleton}</DashboardSkeleton>;
  }

  // Show nothing while redirecting
  if (!isAuthenticated || !user) {
    return null;
  }

  // Check role access
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user.role || !allowedRoles.includes(user.role)) {
      return null;
    }
  }

  return <>{children}</>;
}
