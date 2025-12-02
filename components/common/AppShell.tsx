"use client";

import { usePathname } from "next/navigation";

import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register") || pathname?.startsWith("/verify-otp");
  const isHomePage = pathname === "/";

  if (isDashboard || isAuthPage) {
    // Dashboard and auth pages provide their own layout
    // so we skip the global navbar and wrapper here.
    return <>{children}</>;
  }

  return (
    <div className={isHomePage ? "m-0 p-0" : ""}>
      <Navbar />
      <main className={isHomePage ? "m-0 p-0 w-full" : "mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6"}>
        {children}
      </main>
      <Footer />
    </div>
  );
}


