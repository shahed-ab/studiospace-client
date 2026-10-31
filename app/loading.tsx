import React from "react";
import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
      <Container className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-accent/20 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-xs font-mono tracking-wider uppercase text-muted">
          CALIBRATING PRODUCTION SET...
        </p>
      </Container>
    </div>
  );
}

