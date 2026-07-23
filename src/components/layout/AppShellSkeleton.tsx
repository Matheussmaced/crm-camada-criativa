import { Skeleton } from "@/components/ui/Skeleton";

export function AppShellSkeleton() {
  return (
    <div className="flex h-full">
      <aside className="hidden w-60 shrink-0 flex-col gap-2 border-r border-zinc-200 p-3 dark:border-zinc-800 md:flex">
        <Skeleton className="mb-4 h-8 w-32" />
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800">
          <Skeleton className="h-8 w-full max-w-sm" />
        </div>
        <div className="flex-1 space-y-4 bg-zinc-50 p-6 dark:bg-zinc-950">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full" />
            ))}
          </div>
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    </div>
  );
}
