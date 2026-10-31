import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { FiSearch } from "react-icons/fi";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-dashed border-border bg-surface/50 p-12 sm:p-16 text-center flex flex-col items-center justify-center max-w-2xl mx-auto my-8",
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-elevated border border-border flex items-center justify-center text-accent mb-5 shadow-sm">
        {icon || <FiSearch className="w-8 h-8 text-accent" />}
      </div>

      <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-2">
        {title}
      </h3>

      <p className="text-muted text-sm sm:text-base max-w-md mb-8 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionText && (
          <>
            {actionHref ? (
              <Button asChild variant="primary">
                <Link href={actionHref}>{actionText}</Link>
              </Button>
            ) : (
              <Button variant="primary" onClick={onAction}>
                {actionText}
              </Button>
            )}
          </>
        )}

        {secondaryActionText && (
          <Button variant="outline" onClick={onSecondaryAction}>
            {secondaryActionText}
          </Button>
        )}
      </div>
    </div>
  );
}

