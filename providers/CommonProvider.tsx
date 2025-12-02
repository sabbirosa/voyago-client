import { AuthProvider } from "@/lib/auth/useAuth";
import { ThemeProvider } from "./theme-provider";

export default function CommonProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}
