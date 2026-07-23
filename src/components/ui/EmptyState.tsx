import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-800">
      <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-900">
        <Icon className="h-6 w-6 text-zinc-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{title}</p>
        {description && (
          <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
