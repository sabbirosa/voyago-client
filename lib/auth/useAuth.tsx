"use client";

import { createContext, useContext, useEffect, useState } from "react";

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
  // Placeholder methods – real implementations will be added in Auth module
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // TODO: hydrate from cookies / localStorage or call `/api/auth/me`
    setIsLoading(false);
  }, []);

  const login = async (_payload: { email: string; password: string }) => {
    // TODO: call backend login endpoint and set user state
    setUser({
      id: "placeholder",
      name: "Voyago User",
      email: "user@example.com",
      role: "TOURIST",
    });
  };

  const logout = async () => {
    // TODO: call backend logout endpoint and clear user state
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


