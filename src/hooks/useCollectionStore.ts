import { useSyncExternalStore } from "react";
import type { CollectionStore } from "@/services/storage/createCollectionStore";

export function useCollectionStore<T extends { id: string }>(store: CollectionStore<T>): T[] {
  return useSyncExternalStore(store.subscribe, store.getAll, store.getAll);
}
