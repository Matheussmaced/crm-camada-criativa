"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "./ToastContext";

interface AuthContextValue {
  isAuthenticated: boolean;
  email: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setEmail(session?.user.email ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setEmail(session?.user.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      email,
      login: async (loginEmail, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email: loginEmail.trim(),
          password,
        });
        return !error;
      },
      logout: async () => {
        await supabase.auth.signOut();
        queryClient.clear();
        showToast({ title: "Sessão encerrada", variant: "info" });
      },
    }),
    [isAuthenticated, email, queryClient, showToast]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
