"use client";

import { useRecordStore } from "@/hooks/useRecordStore";
import { settingsStore } from "@/services/storage/settingsStorage";
import type { CompanySettings } from "@/types";

export function useSettings() {
  const settings = useRecordStore(settingsStore);

  function updateSettings(patch: Partial<CompanySettings>) {
    settingsStore.update(patch);
  }

  return { settings, updateSettings };
}
