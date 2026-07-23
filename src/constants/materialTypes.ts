import type { MaterialType } from "@/types";

export const MATERIAL_LABELS: Record<MaterialType, string> = {
  pla: "PLA",
  abs: "ABS",
  petg: "PETG",
  tpu: "TPU",
  nylon: "Nylon",
  outro: "Outro",
};

export const MATERIAL_OPTIONS = Object.entries(MATERIAL_LABELS).map(([value, label]) => ({
  value: value as MaterialType,
  label,
}));
