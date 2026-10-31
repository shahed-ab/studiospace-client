"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { mockUsers } from "@/data/users";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchUser: (userId: string) => void;
  toggleMockUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "studiospace_current_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Start with null and isLoading true to avoid hydration mismatch
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default to logged-in host user Alex Vance for seamless first review
        const defaultUser = mockUsers[0];
        setUser(defaultUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
      }
    } catch {
      setUser(mockUsers[0]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const matched = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const loggedUser: User = matched || {
      id: `usr_${Date.now()}`,
      name: email.split("@")[0],
      email: email,
      role: "user",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    };

    setUser(loggedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
    setIsLoading(false);
    return { success: true };
  };

  const register = async (name: string, email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: "user",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    };

    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const logout = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsLoading(false);
  };

  const switchUser = (userId: string) => {
    const target = mockUsers.find((u) => u.id === userId);
    if (target) {
      setUser(target);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(target));
    }
  };

  const toggleMockUser = () => {
    if (!user) {
      // Logged out -> switch to Alex Vance (Host)
      setUser(mockUsers[0]);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUsers[0]));
    } else if (user.email === mockUsers[0].email) {
      // Alex Vance -> switch to Maya Lin (Creator)
      setUser(mockUsers[1]);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUsers[1]));
    } else {
      // Switch to logged out
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        switchUser,
        toggleMockUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

