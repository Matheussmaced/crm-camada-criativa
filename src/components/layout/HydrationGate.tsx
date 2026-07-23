"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AppShellSkeleton } from "./AppShellSkeleton";

export function HydrationGate({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <AppShellSkeleton />;

  return <>{children}</>;
}
