"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "./ThemeContext";
import { ToastProvider } from "./ToastContext";
import { AuthProvider } from "./AuthContext";
import { SidebarProvider } from "./SidebarContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
