"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useRecordStore } from "@/hooks/useRecordStore";
import { authStore } from "@/services/storage/authStorage";
import { AUTH_CREDENTIALS } from "@/constants/auth";
import { useToast } from "./ToastContext";

interface AuthContextValue {
  isAuthenticated: boolean;
  email: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useRecordStore(authStore);
  const { showToast } = useToast();

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: session.isAuthenticated,
      email: session.email,
      login: (email, password) => {
        const isValid =
          email.trim().toLowerCase() === AUTH_CREDENTIALS.email && password === AUTH_CREDENTIALS.password;
        if (isValid) authStore.set({ isAuthenticated: true, email: AUTH_CREDENTIALS.email });
        return isValid;
      },
      logout: () => {
        authStore.set({ isAuthenticated: false, email: null });
        showToast({ title: "Sessão encerrada", variant: "info" });
      },
    }),
    [session, showToast]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
