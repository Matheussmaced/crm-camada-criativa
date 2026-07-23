import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { HydrationGate } from "@/components/layout/HydrationGate";

export default function AppRouteLayout({ children }: { children: ReactNode }) {
  return (
    <HydrationGate>
      <AppShell>{children}</AppShell>
    </HydrationGate>
  );
}
