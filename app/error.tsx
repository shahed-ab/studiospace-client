"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FiAlertTriangle, FiRefreshCw, FiHome } from "react-icons/fi";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to production logger if available
    console.error("StudioSpace Production Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-16 px-4">
      <Container>
        <div className="max-w-xl mx-auto text-center">
          {/* Warning Icon with ambient glow */}
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-danger/20 blur-2xl rounded-full" />
            <div className="relative w-16 h-16 rounded-2xl bg-surface border-2 border-danger/40 flex items-center justify-center text-danger shadow-xl shadow-danger/20">
              <FiAlertTriangle className="w-8 h-8" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-border text-xs font-semibold text-danger mb-4 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
            PRODUCTION HALTED • RUNTIME ERROR
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
            An Unexpected Glitch Occurred
          </h1>

          <p className="text-muted text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
            Our stage infrastructure hit an unhandled exception while preparing this scene. You can retry the operation or return to the main production overview.
          </p>

          {error.message && (
            <div className="mb-8 p-3.5 rounded-xl bg-elevated border border-border text-left max-w-md mx-auto">
              <span className="text-[11px] font-mono text-muted uppercase tracking-wider block mb-1">
                Diagnostic Trace:
              </span>
              <p className="text-xs font-mono text-danger break-words line-clamp-3">
                {error.message}
              </p>
              {error.digest && (
                <span className="text-[10px] font-mono text-muted/60 block mt-1">
                  Digest ID: {error.digest}
                </span>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={() => reset()}
              variant="primary"
              size="lg"
              className="min-w-[170px]"
            >
              <FiRefreshCw className="mr-2 w-4 h-4" />
              Retry Scene
            </Button>
            <Button asChild variant="secondary" size="lg" className="min-w-[170px]">
              <Link href="/">
                <FiHome className="mr-2 w-4 h-4" />
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

