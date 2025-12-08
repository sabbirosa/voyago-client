"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { apiFetch } from "@/lib/api/client";
import { getMyProfile } from "@/lib/api/user";
import { clearTokens, getTokens, saveTokens } from "@/lib/auth/tokenStorage";

export type UserRole = "TOURIST" | "GUIDE" | "ADMIN" | null;

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
} | null;

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?: "TOURIST" | "GUIDE" | "ADMIN";
};

type RegisterResponse = {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      isApproved: boolean;
      isEmailVerified: boolean;
    };
  };
};

type VerifyOTPResponse = {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
};

type VerifyOTPResult = {
  success: boolean;
  needsApproval?: boolean;
  message?: string;
};

type AuthContextValue = {
  user: AuthUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<RegisterResponse["data"]>;
  verifyOTP: (payload: {
    email: string;
    otp: string;
  }) => Promise<VerifyOTPResult>;
  resendOTP: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Hydrate auth state from stored tokens
    const tokens = getTokens();

    if (tokens) {
      // Fetch real user profile from backend
      getMyProfile()
        .then((profile) => {
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
          });
        })
        .catch((error) => {
          // Log the error for debugging
          console.error("[useAuth] Failed to fetch user profile:", error);
          console.error("[useAuth] Error details:", {
            message: error?.message,
            stack: error?.stack,
          });

          // Check if it's an authentication error (401/403)
          const isAuthError =
            error?.message?.includes("401") ||
            error?.message?.includes("403") ||
            error?.message?.includes("Unauthorized") ||
            error?.message?.includes("Not authenticated");

          // Only clear tokens if it's an auth error
          // For other errors (network, server), keep tokens and let user retry
          if (isAuthError) {
            console.warn("[useAuth] Authentication failed, clearing tokens");
            clearTokens();
            setUser(null);
          } else {
            // For non-auth errors, keep tokens but don't set user
            // This allows the app to continue but user will need to refresh
            console.warn(
              "[useAuth] Non-auth error, keeping tokens:",
              error?.message
            );
            setUser(null); // Don't set user, but keep tokens for retry
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (payload: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await apiFetch<{
        success: boolean;
        data: {
          accessToken: string;
          refreshToken: string;
          expiresIn: string;
        };
      }>("/auth/login", {
        method: "POST",
        body: payload,
      });

      const { accessToken, refreshToken } = response.data;
      saveTokens({ accessToken, refreshToken });

      // Fetch real user profile
      const profile = await getMyProfile();
      setUser({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await apiFetch<RegisterResponse>("/auth/register", {
        method: "POST",
        body: payload,
      });

      // Registration successful - user needs to verify OTP
      return response.data;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (payload: {
    email: string;
    otp: string;
  }): Promise<VerifyOTPResult> => {
    setIsLoading(true);
    try {
      const response = await apiFetch<VerifyOTPResponse>("/auth/verify-otp", {
        method: "POST",
        body: payload,
      });

      const { accessToken, refreshToken } = response.data;
      saveTokens({ accessToken, refreshToken });

      // Try to fetch real user profile
      try {
        const profile = await getMyProfile();
        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
        });
        return { success: true };
      } catch (profileError: any) {
        // If profile fetch fails due to approval, handle gracefully
        const errorMessage = profileError?.message || "";
        if (
          errorMessage.includes("pending approval") ||
          errorMessage.includes("approval")
        ) {
          // Clear tokens since user can't use them yet
          clearTokens();
          return {
            success: true,
            needsApproval: true,
            message:
              "Your email has been verified! Your account is pending approval by an administrator. You will be notified once approved.",
          };
        }
        // For other errors, rethrow
        throw profileError;
      }
    } catch (error: any) {
      // Clear tokens on error
      clearTokens();
      const errorMessage =
        error?.message || "Verification failed. Please try again.";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (email: string) => {
    setIsLoading(true);
    try {
      await apiFetch<{ success: boolean; message: string }>(
        "/auth/resend-otp",
        {
          method: "POST",
          body: { email },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        role: user?.role ?? null,
        login,
        register,
        verifyOTP,
        resendOTP,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
