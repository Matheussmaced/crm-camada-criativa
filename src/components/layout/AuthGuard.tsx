"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";
import { AppShellSkeleton } from "./AppShellSkeleton";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace(ROUTES.login);
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return <AppShellSkeleton />;

  return <>{children}</>;
}
