"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Studio } from "@/types";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

interface WishlistContextType {
  wishlist: Studio[];
  wishlistIds: Set<string>;
  isLoading: boolean;
  isSaved: (studioId: string) => boolean;
  toggleWishlist: (studioId: string, studioTitle?: string) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Studio[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      setWishlistIds(new Set());
      return;
    }
    setIsLoading(true);
    try {
      const items = await getWishlist();
      setWishlist(items);
      setWishlistIds(new Set(items.map((s) => s._id)));
    } catch {
      // Handled silently
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isSaved = useCallback(
    (studioId: string) => wishlistIds.has(studioId),
    [wishlistIds]
  );

  const toggleWishlist = async (
    studioId: string,
    studioTitle: string = "Studio"
  ): Promise<boolean> => {
    if (!user) {
      toast.info("Please log in to save studios", {
        action: {
          label: "Log in",
          onClick: () => {
            const redirectUrl =
              typeof window !== "undefined"
                ? window.location.pathname + window.location.search
                : "/studios";
            router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
          },
        },
      });
      return false;
    }

    const wasSaved = wishlistIds.has(studioId);

    // 1. Optimistic UI update
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (wasSaved) next.delete(studioId);
      else next.add(studioId);
      return next;
    });

    if (wasSaved) {
      setWishlist((prev) => prev.filter((s) => s._id !== studioId));
      toast.info(`Removed "${studioTitle}" from saved studios.`);
    } else {
      toast.success(`Saved "${studioTitle}" to your wishlist!`);
    }

    // 2. Perform API call
    try {
      if (wasSaved) {
        await removeFromWishlist(studioId);
      } else {
        await addToWishlist(studioId);
      }
      return !wasSaved;
    } catch (err: any) {
      // 3. Rollback on failure
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.add(studioId);
        else next.delete(studioId);
        return next;
      });
      await fetchWishlist();
      toast.error("Failed to update saved studios", {
        description: err.message || "Please try again later.",
      });
      return wasSaved;
    }
  };

  const refreshWishlist = async () => {
    await fetchWishlist();
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        isLoading,
        isSaved,
        toggleWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

