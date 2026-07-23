"use client";

import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/ui/Dropdown";
import { useRecordStore } from "@/hooks/useRecordStore";
import { settingsStore } from "@/services/storage/settingsStorage";
import { ROUTES } from "@/constants/routes";

export function UserMenu() {
  const settings = useRecordStore(settingsStore);
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
          onClick: () => undefined,
          danger: true,
        },
      ]}
    />
  );
}
