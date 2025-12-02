"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { apiFetch } from "@/lib/api/client";
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

type AuthContextValue = {
  user: AuthUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<RegisterResponse["data"]>;
  verifyOTP: (payload: { email: string; otp: string }) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Hydrate auth state from stored tokens for now.
    const tokens = getTokens();

    if (tokens) {
      // In a later module we will call `/auth/me` to get the real user.
      setUser({
        id: "placeholder",
        name: "Voyago User",
        email: "user@example.com",
        role: "TOURIST",
      });
    }

    setIsLoading(false);
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

      // TODO: decode token or fetch `/auth/me` for real user info.
    setUser({
      id: "placeholder",
      name: "Voyago User",
      email: "user@example.com",
      role: "TOURIST",
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

  const verifyOTP = async (payload: { email: string; otp: string }) => {
    setIsLoading(true);
    try {
      const response = await apiFetch<VerifyOTPResponse>("/auth/verify-otp", {
        method: "POST",
        body: payload,
      });

      const { accessToken, refreshToken } = response.data;
      saveTokens({ accessToken, refreshToken });

      // TODO: decode token or fetch `/auth/me` for real user info.
      setUser({
        id: "placeholder",
        name: "Voyago User",
        email: payload.email,
        role: "TOURIST",
      });
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


