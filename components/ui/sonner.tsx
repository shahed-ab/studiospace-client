"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-surface group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:py-3.5 group-[.toaster]:px-4 font-body",
          description: "group-[.toast]:text-muted text-sm",
          actionButton:
            "group-[.toast]:bg-accent group-[.toast]:text-white font-medium rounded-full text-xs px-3 py-1.5",
          cancelButton:
            "group-[.toast]:bg-elevated group-[.toast]:text-muted font-medium rounded-full text-xs px-3 py-1.5",
        },
      }}
      {...props}
    />
  );
}

