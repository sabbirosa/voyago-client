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

type AuthContextValue = {
  user: AuthUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole;
  login: (payload: { email: string; password: string }) => Promise<void>;
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


