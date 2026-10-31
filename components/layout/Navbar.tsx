"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserMenu } from "@/components/layout/UserMenu";
import { cn } from "@/lib/utils";
import { FiMenu, FiX, FiPlus, FiArrowRight } from "react-icons/fi";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "About Us", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for subtle shadow enhancement
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8">
      <div
        className={cn(
          "max-w-7xl mx-auto h-16 sm:h-18 rounded-full transition-all duration-300 flex items-center justify-between px-4 sm:px-6",
          "glass-pill shadow-lg border border-border/80",
          scrolled && "shadow-2xl bg-surface/90 backdrop-blur-xl border-white/15"
        )}
      >
        {/* Left: StudioSpace Logo */}
        <div className="flex items-center shrink-0">
          <Logo size="md" href="/" />
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 relative",
                  isActive
                    ? "text-accent font-semibold"
                    : "text-muted hover:text-foreground hover:bg-surface/50"
                )}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions (Theme Toggle, Auth CTA, User Menu) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeToggle />

          {!isLoading && (
            <>
              {user ? (
                // Logged-in state
                <div className="flex items-center gap-3">
                  <Button asChild variant="primary" size="sm" className="hidden sm:inline-flex">
                    <Link href="/add-studio">
                      <FiPlus className="mr-1.5 w-3.5 h-3.5" />
                      Host a Space
                    </Link>
                  </Button>
                  <UserMenu />
                </div>
              ) : (
                // Logged-out state
                <div className="hidden sm:flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild variant="primary" size="sm">
                    <Link href="/add-studio">Host a Space</Link>
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <FiX className="w-5 h-5" />
            ) : (
              <FiMenu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 max-w-7xl mx-auto rounded-3xl glass-panel p-6 shadow-2xl border border-border animate-in fade-in slide-in-from-top-3 duration-200">
          <nav className="flex flex-col space-y-2 mb-6">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2.5 rounded-2xl text-base font-medium transition-colors flex items-center justify-between",
                    isActive
                      ? "bg-accent/15 text-accent font-semibold"
                      : "text-foreground hover:bg-surface"
                  )}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-accent" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-border flex flex-col gap-3">
            {user ? (
              <>
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-xs text-muted">Signed in as</span>
                  <span className="text-xs font-semibold text-foreground truncate max-w-[180px]">
                    {user.name}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/my-bookings">My Bookings</Link>
                  </Button>
                </div>
                <Button asChild variant="primary" size="default" className="w-full">
                  <Link href="/add-studio">
                    <FiPlus className="mr-2 w-4 h-4" />
                    Host a Space
                  </Link>
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Button asChild variant="outline" size="default" className="w-full">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild variant="primary" size="default" className="w-full">
                  <Link href="/register">
                    Create Account
                    <FiArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

