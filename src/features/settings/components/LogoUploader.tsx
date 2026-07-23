"use client";

import { useRef } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLogo } from "../hooks/useLogo";

export function LogoUploader() {
  const { logoUrl, uploadLogo, removeLogo } = useLogo();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="Logo da empresa" className="h-full w-full object-contain" />
        ) : (
          <ImagePlus className="h-6 w-6 text-zinc-400" />
        )}
      </div>
      <div>
        <p className="mb-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Logo da empresa
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            Enviar logo
          </Button>
          {logoUrl && (
            <Button type="button" variant="ghost" size="sm" onClick={removeLogo}>
              <Trash2 className="h-3.5 w-3.5" /> Remover
            </Button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) uploadLogo(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}
