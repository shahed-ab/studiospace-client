"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Container } from "@/components/ui/Container";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "admin";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // ONLY redirect after loading is strictly false and user is confirmed null
    if (!isLoading && !user) {
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`/login?redirect=${returnUrl}`);
    }
  }, [isLoading, user, pathname, router]);

  // While checking auth state on reload, show a branded loading skeleton/spinner
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-24">
        <Container className="flex flex-col items-center text-center">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-surface border border-border shadow-lg mb-6">
            <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            Verifying Backstage Access
          </h3>
          <p className="text-sm text-muted mt-1.5">
            Loading your creator session...
          </p>
        </Container>
      </div>
    );
  }

  // If confirmed logged out, render null until router redirect triggers
  if (!user) {
    return null;
  }

  // Role check if needed
  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    return (
      <div className="min-h-[50vh] flex items-center justify-center py-16">
        <Container className="text-center max-w-md">
          <h3 className="font-heading text-xl font-bold text-danger mb-2">
            Access Restricted
          </h3>
          <p className="text-sm text-muted mb-6">
            You do not have the required permissions to view this backstage area.
          </p>
        </Container>
      </div>
    );
  }

  return <>{children}</>;
}

