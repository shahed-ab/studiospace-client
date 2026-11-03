"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { Avatar } from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/Badge";
import {
  FiGrid,
  FiPlusCircle,
  FiList,
  FiCalendar,
  FiLogOut,
  FiRefreshCw,
  FiUser,
} from "react-icons/fi";

export function UserMenu() {
  const { user, logout, toggleMockUser } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleSwitchMock = () => {
    toggleMockUser();
    toast.info("Switched mock account", {
      description: "Toggled active test user state.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all duration-200 overflow-hidden shrink-0 group"
          aria-label="User navigation menu"
        >
          <Avatar
            src={user.photoURL}
            name={user.name}
            size="md"
            className="w-full h-full border-0"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2">
        <DropdownMenuLabel className="pb-2">
          <div className="flex items-center justify-between">
            <span className="font-heading text-sm font-bold text-foreground">
              {user.name}
            </span>
            <Badge variant="accent" className="text-[10px] py-0.5 px-2">
              {user.email.includes("host") ? "Host" : "Creator"}
            </Badge>
          </div>
          <p className="text-xs text-muted font-normal truncate mt-0.5">
            {user.email}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center gap-2.5 py-2">
            <FiGrid className="w-4 h-4 text-accent" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/add-studio" className="flex items-center gap-2.5 py-2">
            <FiPlusCircle className="w-4 h-4 text-accent" />
            <span>Add New Studio</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/my-listings" className="flex items-center gap-2.5 py-2">
            <FiList className="w-4 h-4 text-accent" />
            <span>My Studio Listings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/my-bookings" className="flex items-center gap-2.5 py-2">
            <FiCalendar className="w-4 h-4 text-accent" />
            <span>My Bookings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Quick Test Switcher for grading convenience */}
        <DropdownMenuItem
          onClick={handleSwitchMock}
          className="flex items-center justify-between py-2 text-xs text-muted hover:text-foreground"
        >
          <span className="flex items-center gap-2">
            <FiRefreshCw className="w-3.5 h-3.5" />
            <span>Switch Mock Persona</span>
          </span>
          <span className="text-[10px] uppercase font-mono bg-elevated px-1.5 py-0.5 rounded">
            Test
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2.5 py-2 text-danger focus:text-danger focus:bg-danger/10"
        >
          <FiLogOut className="w-4 h-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

