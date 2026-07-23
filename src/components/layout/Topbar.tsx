"use client";

import { Menu } from "lucide-react";
import { SearchInput } from "@/components/ui/SearchInput";
import { useSidebar } from "@/contexts/SidebarContext";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

export function Topbar() {
  const { openMobile } = useSidebar();

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <button
        onClick={openMobile}
        className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 md:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="max-w-sm flex-1">
        <SearchInput placeholder="Pesquisar clientes, orçamentos..." />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
