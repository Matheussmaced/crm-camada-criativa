"use client";

import { Box, ChevronsLeft, ChevronsRight } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { useSidebar } from "@/contexts/SidebarContext";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { NavItem } from "./NavItem";
import { cn } from "@/utils/cn";

export function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, closeMobile } = useSidebar();
  const { settings } = useSettings();

  const content = (
    <>
      <div className={cn("flex items-center gap-2 px-3 py-4", collapsed && "justify-center px-2")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <Box className="h-4.5 w-4.5" />
        </div>
        {!collapsed && (
          <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {settings.name}
          </span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2">
        {NAVIGATION_ITEMS.map((item) => (
          <NavItem key={item.href} item={item} collapsed={collapsed} onNavigate={closeMobile} />
        ))}
      </nav>

      <button
        onClick={toggleCollapsed}
        className={cn(
          "mx-2 mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100",
          collapsed && "justify-center px-2"
        )}
      >
        {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        {!collapsed && "Recolher"}
      </button>
    </>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden shrink-0 flex-col border-r border-zinc-200 bg-white transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-950 md:flex",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={closeMobile} />
          <aside className="relative flex w-60 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
