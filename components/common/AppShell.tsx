"use client";

import { usePathname } from "next/navigation";

import { Navbar } from "@/components/common/Navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    // Dashboard provides its own layout and chrome (sidebar, header, etc.)
    // so we skip the global navbar and wrapper here.
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6">
        {children}
      </main>
    </>
  );
}


