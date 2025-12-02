"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/useAuth";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated, role } = useAuth();

  return (
    <header className="border-b bg-background">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold">
          Voyago
        </Link>

        <div className={cn("flex items-center gap-4 text-sm")}>
          <Link href="/explore" className="hover:underline">
            Explore
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="hover:underline">
                Dashboard{role ? ` (${role.toLowerCase()})` : ""}
              </Link>
              <Link href="/profile" className="hover:underline">
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Log in
              </Link>
              <Link href="/register" className="hover:underline">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}


