"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";
import type { ThemeMode } from "@/types";

const OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Laptop },
];

export function ThemeSection() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tema</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-3">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex flex-1 flex-col items-center gap-2 rounded-lg border p-4 text-sm transition-colors",
              theme === option.value
                ? "border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                : "border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            )}
          >
            <option.icon className="h-5 w-5" />
            {option.label}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
