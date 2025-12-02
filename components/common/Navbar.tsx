"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth/useAuth";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { ThemeButton } from "./theme-button";

export function Navbar() {
  const { isAuthenticated, role } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = (
    <>
      <Link
        href="/explore"
        className="hover:text-primary transition-colors"
        onClick={() => setMobileMenuOpen(false)}
      >
        Explore
      </Link>

      {isAuthenticated ? (
        <>
          <Link
            href="/dashboard"
            className="hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard{role ? ` (${role.toLowerCase()})` : ""}
          </Link>
          <Link
            href="/profile"
            className="hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Profile
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sign up
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-7xl px-4">
      <nav className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/80 backdrop-blur-md shadow-lg px-6 py-3">
        <Logo showText size="md" />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          {navLinks}
          <ThemeButton />
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeButton />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">{navLinks}</nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
