"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeContext";
import { ToastProvider } from "./ToastContext";
import { AuthProvider } from "./AuthContext";
import { SidebarProvider } from "./SidebarContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ToastProvider>
        <AuthProvider>
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryProvider>
  );
}
