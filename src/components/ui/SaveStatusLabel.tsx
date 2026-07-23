import { Check, Loader2 } from "lucide-react";
import type { SaveStatus } from "@/hooks/useAutoSave";

export function SaveStatusLabel({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;

  return (
    <span className="flex items-center gap-1 text-xs text-zinc-400">
      {status === "saving" ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" /> Salvando...
        </>
      ) : (
        <>
          <Check className="h-3 w-3 text-emerald-500" /> Salvo automaticamente
        </>
      )}
    </span>
  );
}
