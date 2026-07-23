import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { HydrationGate } from "@/components/layout/HydrationGate";
import { AuthGuard } from "@/components/layout/AuthGuard";

export default function AppRouteLayout({ children }: { children: ReactNode }) {
  return (
    <HydrationGate>
      <AuthGuard>
        <AppShell>{children}</AppShell>
      </AuthGuard>
    </HydrationGate>
  );
}
