import type { LabelHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400",
        className
      )}
      {...props}
    />
  );
}
