"use client";

import type { UserRole } from "@/lib/auth/useAuth";
import { useAuth } from "@/lib/auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook to require specific role(s) for a page/component
 * Redirects if user doesn't have required role
 */
export function useRequireRole(allowedRoles: UserRole[], redirectTo?: string) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.push(redirectTo || "/login");
      return;
    }

    if (!user.role || !allowedRoles.includes(user.role)) {
      // Redirect based on user's role
      if (user.role === "ADMIN") {
        router.push(redirectTo || "/dashboard/admin");
      } else if (user.role === "GUIDE") {
        router.push(redirectTo || "/dashboard/guide");
      } else {
        router.push(redirectTo || "/dashboard");
      }
    }
  }, [user, isAuthenticated, isLoading, allowedRoles, redirectTo, router]);

  return {
    hasAccess: user?.role && allowedRoles.includes(user.role),
    isLoading,
    user,
  };
}
