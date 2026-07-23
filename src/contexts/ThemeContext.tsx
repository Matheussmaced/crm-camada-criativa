"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSettings } from "@/features/settings/hooks/useSettings";
import type { ThemeMode } from "@/types";

const THEME_CACHE_KEY = "crm3d:theme-cache";

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function readCachedTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";
  const cached = window.localStorage.getItem(THEME_CACHE_KEY) as ThemeMode | null;
  return cached ?? "system";
}

function resolveTheme(theme: ThemeMode): "light" | "dark" {
  if (theme === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings, updateSettings } = useSettings();
  const [theme, setThemeState] = useState<ThemeMode>(() => readCachedTheme());
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => resolveTheme(theme));

  // Sincroniza com o valor salvo assim que a query resolver (ex.: troca em outro dispositivo).
  // Ajuste de estado durante a renderização (não em um efeito) por ser uma reação a uma
  // mudança de valor vindo de fora, não um efeito colateral.
  const [lastSeenSettingsTheme, setLastSeenSettingsTheme] = useState(settings.theme);
  if (settings.theme !== lastSeenSettingsTheme) {
    setLastSeenSettingsTheme(settings.theme);
    setThemeState(settings.theme);
  }

  useEffect(() => {
    const next = resolveTheme(theme);
    setResolvedTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    window.localStorage.setItem(THEME_CACHE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => setResolvedTheme(resolveTheme("system"));
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme: (next) => {
        setThemeState(next);
        updateSettings({ theme: next }).catch(() => {});
      },
      toggleTheme: () => {
        const next = resolvedTheme === "dark" ? "light" : "dark";
        setThemeState(next);
        updateSettings({ theme: next }).catch(() => {});
      },
    }),
    [theme, resolvedTheme, updateSettings]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
