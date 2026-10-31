import React from "react";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
