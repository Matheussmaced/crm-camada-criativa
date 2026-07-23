"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationItem } from "@/constants/navigation";
import { cn } from "@/utils/cn";
import { Tooltip } from "@/components/ui/Tooltip";

interface NavItemProps {
  item: NavigationItem;
  collapsed: boolean;
  onNavigate?: () => void;
}

export function NavItem({ item, collapsed, onNavigate }: NavItemProps) {
  const pathname = usePathname();
  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        collapsed && "justify-center px-2",
        isActive
          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
      )}
    >
      <item.icon className="h-4.5 w-4.5 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );

  return collapsed ? (
    <Tooltip content={item.label} side="top">
      {link}
    </Tooltip>
  ) : (
    link
  );
}
