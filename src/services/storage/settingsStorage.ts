import type { CompanySettings } from "@/types";
import { createRecordStore } from "./createRecordStore";
import { STORAGE_KEYS } from "./keys";

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  theme: "system",
  name: "Minha Empresa 3D",
  primaryColor: "#6366f1",
  currency: "BRL",
  language: "pt-BR",
};

export const settingsStore = createRecordStore<CompanySettings>(
  STORAGE_KEYS.settings,
  DEFAULT_COMPANY_SETTINGS
);
