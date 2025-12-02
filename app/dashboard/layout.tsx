// "use client";

// import { useAuth } from "@/lib/auth/useAuth";

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const { user, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <main className="flex min-h-screen items-center justify-center">
//         <p className="text-sm text-muted-foreground">Loading dashboard...</p>
//       </main>
//     );
//   }

//   if (!user) {
//     return (
//       <main className="flex min-h-screen items-center justify-center">
//         <p className="text-sm text-muted-foreground">
//           You must be logged in to view the dashboard.
//         </p>
//       </main>
//     );
//   }

//   return (
//     <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6">
//       <header>
//         <h1 className="text-2xl font-semibold">Dashboard</h1>
//         <p className="text-sm text-muted-foreground">
//           Signed in as {user.name} ({user.role ?? "UNASSIGNED"})
//         </p>
//       </header>
//       <section>{children}</section>
//     </main>
//   );
// }

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The dashboard page provides its own full-screen layout (sidebar, header, etc.),
  // so this layout just passes children through without additional wrapping.
  return children;
}
