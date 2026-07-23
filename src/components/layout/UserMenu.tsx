"use client";

import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/ui/Dropdown";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";

export function UserMenu() {
  const { settings } = useSettings();
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <Dropdown
      trigger={
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
          {settings.name.charAt(0).toUpperCase()}
        </button>
      }
      items={[
        {
          label: "Meu perfil",
          icon: <User className="h-4 w-4" />,
          onClick: () => router.push(ROUTES.settings),
        },
        {
          label: "Configurações",
          icon: <Settings className="h-4 w-4" />,
          onClick: () => router.push(ROUTES.settings),
        },
        {
          label: "Sair",
          icon: <LogOut className="h-4 w-4" />,
          onClick: async () => {
            await logout();
            router.replace(ROUTES.login);
          },
          danger: true,
        },
      ]}
    />
  );
}
