"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "@/types";
import { authClient } from "@/lib/auth-client";
import { http } from "@/lib/http";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password?: string,
    photoURL?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginWithGoogle: (callbackURL?: string) => Promise<void>;
  switchUser: (userId?: string) => void;
  toggleMockUser: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronize BetterAuth session with Express API via /api/bridge
  const syncSessionWithBackend = useCallback(async (): Promise<boolean> => {
    try {
      const bridgeRes = await fetch("/api/bridge");
      if (!bridgeRes.ok) return false;
      const { bridgeToken } = await bridgeRes.json();
      if (!bridgeToken) return false;

      await http.post("/server-api/auth/session", { bridgeToken }, { skipAuthRedirect: true });
      return true;
    } catch (err) {
      console.error("Failed to bridge session to backend:", err);
      return false;
    }
  }, []);

  const initAuth = useCallback(async () => {
    try {
      // 1. Check BetterAuth session
      const sessionRes = await authClient.getSession();
      const authUser = sessionRes?.data?.user;

      if (!authUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // 2. Check if Express backend has a valid cookie
      let hasValidCookie = false;
      try {
        const meRes = await http.get("/server-api/auth/me", { skipAuthRedirect: true });
        if (meRes?.user) {
          hasValidCookie = true;
        }
      } catch {
        // Express cookie missing or expired (401)
        hasValidCookie = false;
      }

      // 3. If missing or expired, silently re-bridge
      if (!hasValidCookie) {
        await syncSessionWithBackend();
      }

      setUser({
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        photoURL: authUser.image || undefined,
        role: "user",
      });
    } catch (err) {
      console.error("Auth init error:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [syncSessionWithBackend]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await authClient.signIn.email({
        email,
        password: password || "",
      });

      // BetterAuth returns { data, error } — error is null on success
      if (res?.error) {
        setIsLoading(false);
        return { success: false, error: res.error.message || "Invalid email or password" };
      }

      // Run bridge to create Express JWT cookie
      await syncSessionWithBackend();

      // Retrieve full user session
      const sessionRes = await authClient.getSession();
      const authUser = sessionRes?.data?.user;
      if (authUser) {
        setUser({
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
          photoURL: authUser.image || undefined,
          role: "user",
        });
      }

      // Keep isLoading=true until after setUser has propagated so ProtectedRoute
      // never briefly sees {isLoading:false, user:null} during navigation.
      // We set it false in a microtask so the user state settles first.
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || "Failed to log in" };
    }
  };

  const register = async (
    name: string,
    email: string,
    password?: string,
    photoURL?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await authClient.signUp.email({
        name,
        email,
        password: password || "",
        image: photoURL || undefined,
      });

      if (res.error) {
        setIsLoading(false);
        return { success: false, error: res.error.message || "Registration failed" };
      }

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || "Registration failed" };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await Promise.allSettled([
        authClient.signOut(),
        http.post("/server-api/auth/logout", {}, { skipAuthRedirect: true }),
      ]);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (callbackURL: string = "/dashboard") => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL,
    });
  };

  const switchUser = () => {
    toast.info("Real authentication is active. Use Login/Register to switch accounts.");
  };

  const toggleMockUser = () => {
    toast.info("Real authentication is active. Sign in with your real account.");
  };

  const refreshSession = async () => {
    await initAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        loginWithGoogle,
        switchUser,
        toggleMockUser,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
